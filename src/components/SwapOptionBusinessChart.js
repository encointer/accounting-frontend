import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// Plugin: draw inline legend labels to the right of each bar group
const inlineLegendPlugin = {
    id: "inlineLegend",
    afterDraw(chart) {
        if (!chart.scales.x) return;
        const meta0 = chart.getDatasetMeta(0);
        if (!meta0 || !meta0.data.length) return;

        const ctx = chart.ctx;
        // Collect actual y position and max x per stack per data index
        const stackBars = {};
        chart.data.datasets.forEach((ds, di) => {
            const meta = chart.getDatasetMeta(di);
            if (meta.hidden) return;
            const stack = ds.stack;
            if (!stackBars[stack]) stackBars[stack] = { label: ds.stackLabel || stack, rows: {} };
            meta.data.forEach((bar, i) => {
                if (!stackBars[stack].rows[i]) stackBars[stack].rows[i] = { x: 0, y: bar.y };
                if (bar.x > stackBars[stack].rows[i].x) stackBars[stack].rows[i].x = bar.x;
                stackBars[stack].rows[i].y = bar.y; // all bars in same stack/index share y
            });
        });

        ctx.save();
        ctx.font = "9px Poppins, sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#666";

        // Draw label at end of each stack for first data index only
        for (const [, info] of Object.entries(stackBars)) {
            const row = info.rows[0];
            if (!row || row.x <= chart.scales.x.left + 2) continue;
            ctx.fillText(info.label, row.x + 4, row.y);
        }
        ctx.restore();
    },
};

Chart.register(inlineLegendPlugin);

const SwapOptionBusinessChart = ({ businesses, assetLabel, assetKey }) => {
    const { data, options } = useMemo(() => {
        if (!businesses || businesses.length === 0) return { data: null, options: null };

        // Sort by total swap option value (exercised+active+approved+proposed) descending
        const sorted = [...businesses]
            .map((b) => {
                const s = b.swapOptions[assetKey];
                return { ...b, totalSwap: s.exercised + s.active + s.approved + s.proposed };
            })
            .filter((b) => b.totalSwap > 0 || (b.ccInfluxCurrentMonth || 0) + (b.ccInflux3m || 0) + (b.ccInfluxOlder || 0) > 0)
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
                stackLabel: "Swap",
            },
            {
                label: `Active (${assetLabel})`,
                data: sorted.map((b) => b.swapOptions[assetKey].active),
                backgroundColor: "rgba(72, 199, 142, 0.8)",
                stack: "swap",
                stackLabel: "Swap",
            },
            {
                label: `Approved (${assetLabel})`,
                data: sorted.map((b) => b.swapOptions[assetKey].approved),
                backgroundColor: "rgba(62, 142, 208, 0.8)",
                stack: "swap",
                stackLabel: "Swap",
            },
            {
                label: `Proposed (${assetLabel})`,
                data: sorted.map((b) => b.swapOptions[assetKey].proposed),
                backgroundColor: "rgba(255, 183, 77, 0.6)",
                borderColor: "rgba(255, 183, 77, 1)",
                borderWidth: 1,
                borderDash: [4, 4],
                stack: "swap",
                stackLabel: "Swap",
            },
            {
                label: "CC influx (this month)",
                data: sorted.map((b) => b.ccInfluxCurrentMonth || 0),
                backgroundColor: "rgba(232, 143, 107, 0.9)",
                stack: "ccInflux",
                stackLabel: "CC influx",
            },
            {
                label: "CC influx (last 3 months)",
                data: sorted.map((b) => b.ccInflux3m || 0),
                backgroundColor: "rgba(232, 143, 107, 0.6)",
                stack: "ccInflux",
                stackLabel: "CC influx",
            },
            {
                label: "CC influx (older)",
                data: sorted.map((b) => b.ccInfluxOlder || 0),
                backgroundColor: "rgba(232, 143, 107, 0.3)",
                stack: "ccInflux",
                stackLabel: "CC influx",
            },
            {
                label: "CC outflow: 2-cycle",
                data: sorted.map((b) => b.ccOutflow.outflow2),
                backgroundColor: "rgba(255, 215, 0, 0.7)",
                stack: "circ",
                stackLabel: "CC outflow",
            },
            {
                label: "CC outflow: 3-cycle",
                data: sorted.map((b) => b.ccOutflow.outflow3),
                backgroundColor: "rgba(255, 165, 0, 0.7)",
                stack: "circ",
                stackLabel: "CC outflow",
            },
            {
                label: "CC outflow: 4+-cycle",
                data: sorted.map((b) => b.ccOutflow.outflow4plus),
                backgroundColor: "rgba(220, 120, 0, 0.7)",
                stack: "circ",
                stackLabel: "CC outflow",
            },
            {
                label: "CC outflow: non-circular",
                data: sorted.map((b) => b.ccOutflow.outflowNonCircular),
                backgroundColor: "rgba(200, 200, 200, 0.5)",
                stack: "circ",
                stackLabel: "CC outflow",
            },
        ];

        return {
            data: { labels, datasets },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { right: 80 },
                },
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
