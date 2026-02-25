import { Bar } from "react-chartjs-2";
import { useMemo } from "react";

const VotingPowerChart = ({ proposals }) => {
    const { histogram, participation, summary } = useMemo(() => {
        if (!proposals.length) return {};

        // Collect all power levels across proposals
        const allPowers = new Set();
        for (const p of proposals) {
            for (const k of Object.keys(p.votersByPower)) allPowers.add(Number(k));
            for (const k of Object.keys(p.electorateByPower)) allPowers.add(Number(k));
        }
        const powers = [...allPowers].sort((a, b) => a - b);
        if (!powers.length) return {};

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

        // Summary stats
        let totalVotes = 0,
            totalVoters = 0,
            totalElectorate = 0,
            totalElectorateVotes = 0;
        for (const p of proposals) {
            for (const [pw, n] of Object.entries(p.votersByPower)) {
                totalVotes += Number(pw) * n;
                totalVoters += n;
            }
            for (const [pw, n] of Object.entries(p.electorateByPower)) {
                totalElectorateVotes += Number(pw) * n;
                totalElectorate += n;
            }
        }

        return {
            histogram: { labels: powers, data: histogramData },
            participation: { labels: powers, data: participationData },
            summary: {
                avgPowerVoters: totalVoters > 0 ? totalVotes / totalVoters : 0,
                avgPowerElectorate: totalElectorate > 0 ? totalElectorateVotes / totalElectorate : 0,
                proposalCount: proposals.length,
            },
        };
    }, [proposals]);

    if (!histogram || !participation) return null;

    const pctData = (arr) => arr.map((d) => Math.round(d * 1000) / 10);
    const pctTick = (v) => `${v}%`;
    const pctTooltip = { callbacks: { label: (ctx) => `${ctx.raw}%` } };
    const font = { family: "Poppins" };

    return (
        <div>
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
                    <p className="has-text-grey is-size-7 mt-1">
                        Ideal 1p1v: 100% at 1 rep. Avg power among voters:{" "}
                        {summary.avgPowerVoters.toFixed(2)}. Averaged over {summary.proposalCount} proposals.
                    </p>
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
                    <p className="has-text-grey is-size-7 mt-1">
                        Avg power in electorate: {summary.avgPowerElectorate.toFixed(2)}. Per-proposal average over
                        proposals with eligible voters at that level.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VotingPowerChart;
