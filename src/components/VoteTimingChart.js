import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(...registerables, annotationPlugin);

const VoteTimingChart = ({ votes, attestingWindows, proposals }) => {
    if (!votes || votes.length === 0) return null;

    // Build a start-time lookup per proposal
    const proposalStart = {};
    const proposalLifetime = {};
    proposals.forEach((p) => {
        proposalStart[p.id] = p.start;
        proposalLifetime[p.id] = p.proposalLifetime;
    });

    const msToHours = (ms) => ms / (1000 * 3600);

    // Scatter points: vote offset in hours from proposal start
    const ayePoints = [];
    const nayPoints = [];
    votes.forEach((v) => {
        const start = proposalStart[v.proposalId];
        if (start === undefined) return;
        const offsetHours = msToHours(v.timestamp - start);
        const point = { x: offsetHours, y: v.proposalId };
        if (v.vote === "Aye") ayePoints.push(point);
        else nayPoints.push(point);
    });

    // Annotation boxes for attesting windows overlapping each proposal's lifetime
    const annotations = {};
    let idx = 0;
    proposals.forEach((p) => {
        const pStart = p.start;
        const pEnd = pStart + (p.proposalLifetime || 0);
        attestingWindows.forEach((w) => {
            if (w.end < pStart || w.start > pEnd) return;
            const xMin = msToHours(Math.max(w.start, pStart) - pStart);
            const xMax = msToHours(Math.min(w.end, pEnd) - pStart);
            annotations[`att_${idx++}`] = {
                type: "box",
                xMin,
                xMax,
                yMin: p.id - 0.4,
                yMax: p.id + 0.4,
                backgroundColor: "rgba(255, 206, 86, 0.15)",
                borderColor: "rgba(255, 206, 86, 0.4)",
                borderWidth: 1,
            };
        });
    });

    const proposalIds = proposals.map((p) => p.id);
    const minId = Math.min(...proposalIds);
    const maxId = Math.max(...proposalIds);

    return (
        <div>
            <Scatter
                data={{
                    datasets: [
                        {
                            label: "Aye",
                            data: ayePoints,
                            backgroundColor: "rgba(75, 192, 75, 0.7)",
                            borderColor: "rgba(75, 192, 75, 1)",
                            pointRadius: 5,
                        },
                        {
                            label: "Nay",
                            data: nayPoints,
                            backgroundColor: "rgba(255, 99, 132, 0.7)",
                            borderColor: "rgba(255, 99, 132, 1)",
                            pointRadius: 5,
                        },
                    ],
                }}
                options={{
                    plugins: {
                        annotation: { annotations },
                        legend: {
                            labels: {
                                font: { size: 13, family: "Poppins" },
                            },
                        },
                        tooltip: {
                            callbacks: {
                                label: (ctx) =>
                                    `Proposal #${ctx.raw.y} — ${ctx.dataset.label} at ${ctx.raw.x.toFixed(1)}h`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            type: "linear",
                            title: {
                                text: "Hours since proposal submission",
                                display: true,
                                font: { size: 15, family: "Poppins" },
                            },
                            ticks: {
                                font: { size: 13, family: "Poppins" },
                            },
                        },
                        y: {
                            type: "linear",
                            title: {
                                text: "Proposal ID",
                                display: true,
                                font: { size: 15, family: "Poppins" },
                            },
                            ticks: {
                                stepSize: 1,
                                font: { size: 13, family: "Poppins" },
                            },
                            min: minId - 0.5,
                            max: maxId + 0.5,
                        },
                    },
                }}
            />
        </div>
    );
};

export default VoteTimingChart;
