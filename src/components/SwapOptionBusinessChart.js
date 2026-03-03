import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const SwapOptionBusinessChart = ({ businesses, assetLabel, assetKey }) => {
    const { data, options } = useMemo(() => {
        if (!businesses || businesses.length === 0) return { data: null, options: null };

        // Sort by total swap option value (exercised+active+approved+proposed) descending
        const sorted = [...businesses]
            .map((b) => {
                const s = b.swapOptions[assetKey];
                return { ...b, totalSwap: s.exercised + s.active + s.approved + s.proposed };
            })
            .filter((b) => b.totalSwap > 0 || b.ccInfluxAllTime > 0)
            .sort((a, b) => b.totalSwap - a.totalSwap);

        if (sorted.length === 0) return { data: null, options: null };

        const labels = sorted.map((b) =>
            b.name ? `${b.name} (${b.address.slice(0, 6)}...)` : `${b.address.slice(0, 10)}...`
        );

        const datasets = [
            {
                label: `Exercised (${assetLabel})`,
                data: sorted.map((b) => b.swapOptions[assetKey].exercised),
                backgroundColor: "rgba(156, 109, 217, 0.8)",
                stack: "swap",
            },
            {
                label: `Active (${assetLabel})`,
                data: sorted.map((b) => b.swapOptions[assetKey].active),
                backgroundColor: "rgba(72, 199, 142, 0.8)",
                stack: "swap",
            },
            {
                label: `Approved (${assetLabel})`,
                data: sorted.map((b) => b.swapOptions[assetKey].approved),
                backgroundColor: "rgba(62, 142, 208, 0.8)",
                stack: "swap",
            },
            {
                label: `Proposed (${assetLabel})`,
                data: sorted.map((b) => b.swapOptions[assetKey].proposed),
                backgroundColor: "rgba(255, 183, 77, 0.6)",
                borderColor: "rgba(255, 183, 77, 1)",
                borderWidth: 1,
                borderDash: [4, 4],
                stack: "swap",
            },
            {
                label: "CC influx (3 months)",
                data: sorted.map((b) => b.ccInflux3m),
                backgroundColor: "rgba(232, 143, 107, 0.7)",
                stack: "cc3m",
            },
            {
                label: "CC influx (all-time)",
                data: sorted.map((b) => b.ccInfluxAllTime),
                backgroundColor: "rgba(232, 143, 107, 0.35)",
                stack: "ccAll",
            },
            {
                label: "CC outflow: 2-cycle",
                data: sorted.map((b) => b.ccOutflow.outflow2),
                backgroundColor: "rgba(255, 215, 0, 0.7)",
                stack: "circ",
            },
            {
                label: "CC outflow: 3-cycle",
                data: sorted.map((b) => b.ccOutflow.outflow3),
                backgroundColor: "rgba(255, 165, 0, 0.7)",
                stack: "circ",
            },
            {
                label: "CC outflow: 4+-cycle",
                data: sorted.map((b) => b.ccOutflow.outflow4plus),
                backgroundColor: "rgba(220, 120, 0, 0.7)",
                stack: "circ",
            },
            {
                label: "CC outflow: non-circular",
                data: sorted.map((b) => b.ccOutflow.outflowNonCircular),
                backgroundColor: "rgba(200, 200, 200, 0.5)",
                stack: "circ",
            },
        ];

        return {
            data: { labels, datasets },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        stacked: true,
                        title: { display: true, text: "Amount", font: { size: 12, family: "Poppins" } },
                        ticks: { font: { size: 10, family: "Poppins" } },
                    },
                    y: {
                        stacked: true,
                        ticks: { font: { size: 10, family: "Poppins" } },
                    },
                },
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { font: { size: 10, family: "Poppins" }, boxWidth: 12 },
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.x.toFixed(2)}`,
                        },
                    },
                },
            },
        };
    }, [businesses, assetLabel, assetKey]);

    if (!data) {
        return <p className="has-text-grey is-size-7">No business data available.</p>;
    }

    const height = Math.max(200, data.labels.length * 80);

    return (
        <div style={{ height: `${height}px` }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default SwapOptionBusinessChart;
