import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const VotingPowerChart = ({ proposals, reputationLifetime }) => {
    const { histogram, participation, gaussian, summary } = useMemo(() => {
        if (!proposals.length) return {};

        const maxPower = (reputationLifetime || 5) - 2;
        const powers = Array.from({ length: maxPower }, (_, i) => i + 1);

        // Mean voter count per power level, averaged across proposals
        const meanVoters = powers.map((power) => {
            let sum = 0, count = 0;
            for (const p of proposals) {
                sum += p.votersByPower[power] || 0;
                count++;
            }
            return count > 0 ? sum / count : 0;
        });

        // Participation rate: voters / eligible per power level, averaged over proposals
        const participationData = powers.map((power) => {
            let sum = 0, count = 0;
            for (const p of proposals) {
                const eligible = p.electorateByPower[power] || 0;
                if (eligible === 0) continue;
                sum += (p.votersByPower[power] || 0) / eligible;
                count++;
            }
            return count > 0 ? sum / count : 0;
        });

        // Gaussian fit: weighted mean and std from mean voter counts
        const totalMeanVoters = meanVoters.reduce((a, b) => a + b, 0);
        let mu = 0, sigma = 0;
        if (totalMeanVoters > 0) {
            const weights = meanVoters.map((v) => v / totalMeanVoters);
            mu = powers.reduce((s, p, i) => s + p * weights[i], 0);
            const variance = powers.reduce((s, p, i) => s + (p - mu) ** 2 * weights[i], 0);
            sigma = Math.sqrt(variance);
        }

        // Gaussian curve sampled at each power level, scaled to match bar heights
        const maxMv = Math.max(...meanVoters);
        const gaussValues = powers.map((p) => {
            if (sigma <= 0 || maxMv <= 0) return 0;
            const g = Math.exp(-0.5 * ((p - mu) / sigma) ** 2);
            return g * maxMv;
        });

        // CV² statistic
        let allVoterPowers = [];
        for (const p of proposals) {
            for (const [pw, n] of Object.entries(p.votersByPower)) {
                for (let i = 0; i < n; i++) allVoterPowers.push(Number(pw));
            }
        }
        let normalizedVariance = 0;
        if (allVoterPowers.length > 0) {
            const mean = allVoterPowers.reduce((a, b) => a + b, 0) / allVoterPowers.length;
            const variance = allVoterPowers.reduce((s, v) => s + (v - mean) ** 2, 0) / allVoterPowers.length;
            normalizedVariance = mean > 0 ? variance / (mean * mean) : 0;
        }

        return {
            histogram: { labels: powers, data: meanVoters },
            participation: { labels: powers, data: participationData },
            gaussian: { values: gaussValues, mu, sigma },
            summary: {
                normalizedVariance,
                avgPower: allVoterPowers.length > 0
                    ? allVoterPowers.reduce((a, b) => a + b, 0) / allVoterPowers.length
                    : 0,
                proposalCount: proposals.length,
            },
        };
    }, [proposals, reputationLifetime]);

    if (!histogram || !participation) return null;

    const font = { family: "Poppins" };
    const pctData = (arr) => arr.map((d) => Math.round(d * 1000) / 10);
    const pctTick = (v) => `${v}%`;
    const pctTooltip = { callbacks: { label: (ctx) => `${ctx.raw}%` } };

    const histLabels = histogram.labels.map((l) => `${l} rep${l > 1 ? "s" : ""}`);

    return (
        <div>
            <p className="is-size-7 mb-3">
                Voting power inequality (CV&sup2;): <strong>{summary.normalizedVariance.toFixed(3)}</strong>
                {" "}&mdash; 0 = perfect 1p1v, higher = more unequal.
                Avg power among voters: {summary.avgPower.toFixed(2)}.
                Gaussian fit: &mu;={gaussian.mu.toFixed(2)}, &sigma;={gaussian.sigma.toFixed(2)}.
                Based on {summary.proposalCount} proposals.
            </p>
            <div className="columns">
                <div className="column">
                    <Bar
                        data={{
                            labels: histLabels,
                            datasets: [
                                {
                                    type: "bar",
                                    label: "Mean voters per proposal",
                                    data: histogram.data.map((v) => Math.round(v * 10) / 10),
                                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                                    borderColor: "rgba(54, 162, 235, 1)",
                                    borderWidth: 1,
                                    order: 2,
                                },
                                {
                                    type: "line",
                                    label: `Gaussian (μ=${gaussian.mu.toFixed(2)}, σ=${gaussian.sigma.toFixed(2)})`,
                                    data: gaussian.values.map((v) => Math.round(v * 10) / 10),
                                    borderColor: "rgba(220, 50, 50, 0.8)",
                                    borderDash: [5, 3],
                                    borderWidth: 1.5,
                                    pointRadius: 0,
                                    fill: false,
                                    tension: 0.4,
                                    order: 1,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: "Voting Power Distribution (among voters)",
                                    font: { size: 14, ...font },
                                },
                                legend: {
                                    labels: { font: { size: 10, ...font } },
                                },
                                tooltip: {
                                    filter: (item) => item.datasetIndex === 0,
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: { text: "Mean voters per proposal", display: true, font: { size: 13, ...font } },
                                    ticks: { font: { size: 12, ...font } },
                                },
                                x: {
                                    type: "category",
                                    title: { text: "Voting power (reputations)", display: true, font: { size: 13, ...font } },
                                    ticks: { font: { size: 12, ...font } },
                                },
                            },
                        }}
                    />
                </div>
                <div className="column">
                    <Bar
                        data={{
                            labels: participation.labels.map((l) => `${l} rep${l > 1 ? "s" : ""}`),
                            datasets: [
                                {
                                    label: "Participation rate",
                                    data: pctData(participation.data),
                                    backgroundColor: "rgba(75, 192, 75, 0.6)",
                                    borderColor: "rgba(75, 192, 75, 1)",
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: "Participation Rate by Voting Power",
                                    font: { size: 14, ...font },
                                },
                                legend: { display: false },
                                tooltip: pctTooltip,
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: { text: "% of eligible who voted", display: true, font: { size: 13, ...font } },
                                    ticks: { callback: pctTick, font: { size: 12, ...font } },
                                },
                                x: {
                                    title: { text: "Voting power (reputations)", display: true, font: { size: 13, ...font } },
                                    ticks: { font: { size: 12, ...font } },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default VotingPowerChart;
