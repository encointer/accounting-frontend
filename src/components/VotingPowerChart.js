import { Bar } from "react-chartjs-2";
import { useMemo } from "react";

const VotingPowerChart = ({ proposals, reputationLifetime }) => {
    const { histogram, participation, summary } = useMemo(() => {
        if (!proposals.length) return {};

        const maxPower = (reputationLifetime || 5) - 1;
        const powers = Array.from({ length: maxPower }, (_, i) => i + 1);

        // Histogram: fraction of voters at each power level, averaged over proposals
        const histogramData = powers.map((power) => {
            let sum = 0,
                count = 0;
            for (const p of proposals) {
                const total = Object.values(p.votersByPower).reduce((a, b) => a + b, 0);
                if (total === 0) continue;
                sum += (p.votersByPower[power] || 0) / total;
                count++;
            }
            return count > 0 ? sum / count : 0;
        });

        // Participation rate: voters / eligible per power level, averaged over proposals
        const participationData = powers.map((power) => {
            let sum = 0,
                count = 0;
            for (const p of proposals) {
                const eligible = p.electorateByPower[power] || 0;
                if (eligible === 0) continue;
                sum += (p.votersByPower[power] || 0) / eligible;
                count++;
            }
            return count > 0 ? sum / count : 0;
        });

        // Normalized variance of voting power among voters (0 = perfect 1p1v)
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
            normalizedVariance = mean > 0 ? variance / (mean * mean) : 0; // coefficient of variation squared
        }

        return {
            histogram: { labels: powers, data: histogramData },
            participation: { labels: powers, data: participationData },
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

    const pctData = (arr) => arr.map((d) => Math.round(d * 1000) / 10);
    const pctTick = (v) => `${v}%`;
    const pctTooltip = { callbacks: { label: (ctx) => `${ctx.raw}%` } };
    const font = { family: "Poppins" };

    return (
        <div>
            <p className="is-size-7 mb-3">
                Voting power inequality (CV&sup2;): <strong>{summary.normalizedVariance.toFixed(3)}</strong>
                {" "}&mdash; 0 = perfect 1p1v, higher = more unequal.
                Avg power among voters: {summary.avgPower.toFixed(2)}.
                Based on {summary.proposalCount} proposals.
            </p>
            <div className="columns">
                <div className="column">
                    <Bar
                        data={{
                            labels: histogram.labels.map((l) => `${l} rep${l > 1 ? "s" : ""}`),
                            datasets: [
                                {
                                    label: "Fraction of voters",
                                    data: pctData(histogram.data),
                                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                                    borderColor: "rgba(54, 162, 235, 1)",
                                    borderWidth: 1,
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
                                legend: { display: false },
                                tooltip: pctTooltip,
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: { text: "% of voters", display: true, font: { size: 13, ...font } },
                                    ticks: { callback: pctTick, font: { size: 12, ...font } },
                                },
                                x: {
                                    title: {
                                        text: "Voting power (reputations)",
                                        display: true,
                                        font: { size: 13, ...font },
                                    },
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
                                    title: {
                                        text: "% of eligible who voted",
                                        display: true,
                                        font: { size: 13, ...font },
                                    },
                                    ticks: { callback: pctTick, font: { size: 12, ...font } },
                                },
                                x: {
                                    title: {
                                        text: "Voting power (reputations)",
                                        display: true,
                                        font: { size: 13, ...font },
                                    },
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
