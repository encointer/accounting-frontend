import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const MIN_DAYS = 10 / (60 * 24); // 10 minutes in days

function buildLogHistogram(values, numBins) {
    const positive = values.filter((v) => v > 0).map((v) => Math.max(v, MIN_DAYS));
    if (positive.length === 0) return { labels: [], counts: [] };

    const logMin = Math.log10(MIN_DAYS);
    const logMax = Math.log10(Math.max(...positive));
    const step = (logMax - logMin) / numBins;

    const counts = new Array(numBins).fill(0);
    const edges = [];
    for (let i = 0; i <= numBins; i++) {
        edges.push(Math.pow(10, logMin + i * step));
    }

    for (const v of positive) {
        let bin = Math.floor((Math.log10(v) - logMin) / step);
        if (bin >= numBins) bin = numBins - 1;
        if (bin < 0) bin = 0;
        counts[bin]++;
    }

    const labels = [];
    for (let i = 0; i < numBins; i++) {
        const lo = edges[i];
        const hi = edges[i + 1];
        labels.push(fmtDays(hi));
    }

    return { labels, counts, edges };
}

function fmtDays(days) {
    if (days < 1 / 24) {
        const min = days * 24 * 60;
        return `${Math.round(min)}min`;
    }
    if (days < 1) {
        const hrs = days * 24;
        return `${hrs.toFixed(1)}h`;
    }
    return `${days.toFixed(1)}d`;
}

const VoteTimingChart = ({ votes, proposals }) => {
    if (!votes || votes.length === 0) return null;

    const proposalStart = {};
    proposals.forEach((p) => {
        proposalStart[p.id] = p.start;
    });

    const msToDays = (ms) => ms / (1000 * 3600 * 24);

    const offsets = [];
    votes.forEach((v) => {
        const start = proposalStart[v.proposalId];
        if (start === undefined) return;
        const days = msToDays(v.timestamp - start);
        if (days > 0) offsets.push(days);
    });

    const { labels, counts } = buildLogHistogram(offsets, 50);
    if (labels.length === 0) return null;

    return (
        <Bar
            data={{
                labels,
                datasets: [
                    {
                        label: "Votes",
                        data: counts,
                        backgroundColor: "#4878a8",
                        borderColor: "#333",
                        borderWidth: 0.5,
                    },
                ],
            }}
            options={{
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: (items) => labels[items[0].dataIndex],
                            label: (item) => `${item.parsed.y} votes`,
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            text: "Time since proposal submission (log scale)",
                            display: true,
                            font: { size: 15, family: "Poppins" },
                        },
                        ticks: {
                            maxTicksLimit: 10,
                            font: { size: 10, family: "Poppins" },
                            maxRotation: 45,
                            minRotation: 45,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            text: "Number of Votes",
                            display: true,
                            font: { size: 15, family: "Poppins" },
                        },
                        ticks: {
                            font: { size: 13, family: "Poppins" },
                            stepSize: 1,
                        },
                    },
                },
            }}
        />
    );
};

export default VoteTimingChart;
