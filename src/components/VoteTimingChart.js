import { Line } from "react-chartjs-2";
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

    const total = positive.length;
    let cum = 0;
    const cumPcts = counts.map((c) => {
        cum += c;
        return (cum / total) * 100;
    });

    return { labels, cumPcts, edges };
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

    const { labels, cumPcts, edges } = buildLogHistogram(offsets, 50);
    if (labels.length === 0) return null;

    // Find bin indices closest to desired tick positions
    const TICK_TARGETS = [
        { days: 11 / (60 * 24), label: "≤ 11min" },
        { days: 1 / 24, label: "1h" },
        { days: 12 / 24, label: "12h" },
        { days: 1, label: "1d" },
        { days: 4, label: "4d" },
    ];
    const tickIndices = new Set();
    const tickLabelsMap = {};
    for (const { days, label } of TICK_TARGETS) {
        let best = 0;
        let bestDist = Infinity;
        for (let i = 0; i < edges.length - 1; i++) {
            const dist = Math.abs(Math.log10(edges[i + 1]) - Math.log10(days));
            if (dist < bestDist) {
                bestDist = dist;
                best = i;
            }
        }
        tickIndices.add(best);
        tickLabelsMap[best] = label;
    }

    return (
        <Line
            data={{
                labels,
                datasets: [
                    {
                        label: "Cumulative votes",
                        data: cumPcts,
                        borderColor: "#4878a8",
                        backgroundColor: "rgba(72, 120, 168, 0.1)",
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: true,
                    },
                ],
            }}
            options={{
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        intersect: false,
                        mode: "index",
                        callbacks: {
                            title: (items) => `≤ ${labels[items[0].dataIndex]}`,
                            label: (item) => `${item.parsed.y.toFixed(1)}%`,
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
                        afterBuildTicks: (axis) => {
                            axis.ticks = [...tickIndices]
                                .sort((a, b) => a - b)
                                .map((v) => ({ value: v }));
                        },
                        ticks: {
                            font: { size: 12, family: "Poppins" },
                            callback: (_, index, ticks) => {
                                const binIndex = ticks[index].value;
                                return tickLabelsMap[binIndex] || "";
                            },
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            text: "% of Votes",
                            display: true,
                            font: { size: 15, family: "Poppins" },
                        },
                        ticks: {
                            font: { size: 13, family: "Poppins" },
                            callback: (value) => `${value}%`,
                        },
                    },
                },
            }}
        />
    );
};

export default VoteTimingChart;
