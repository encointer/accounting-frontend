import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// Custom plugin to draw dashed arc for proposed options
const dashedArcPlugin = {
    id: "dashedArc",
    afterDraw(chart) {
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data.length) return;
        const proposedFraction = chart.options.plugins.dashedArc?.proposedFraction || 0;
        const isOverclaiming = chart.options.plugins.dashedArc?.isOverclaiming || false;
        if (proposedFraction <= 0) return;

        const ctx = chart.ctx;
        const { x, y, innerRadius, outerRadius } = meta.data[0].getProps(
            ["x", "y", "innerRadius", "outerRadius"], true
        );
        const midRadius = (innerRadius + outerRadius) / 2;
        const lineWidth = (outerRadius - innerRadius) * 0.6;

        // Find where the committed (enacted+approved) slices end
        const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        const committedSum = chart.data.datasets[0].data
            .slice(0, -1) // all except "Free" (last slice)
            .reduce((a, b) => a + b, 0);

        const startAngle = -Math.PI / 2 + (committedSum / total) * 2 * Math.PI;
        const arcAngle = proposedFraction * 2 * Math.PI;
        const endAngle = startAngle + arcAngle;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, midRadius, startAngle, endAngle);
        ctx.strokeStyle = isOverclaiming ? "rgba(255, 60, 60, 0.8)" : "rgba(255, 165, 0, 0.7)";
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.restore();
    },
};

// Custom plugin to draw center text
const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart) {
        const text = chart.options.plugins.centerText?.text;
        if (!text) return;
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data.length) return;
        const { x, y } = meta.data[0].getProps(["x", "y"], true);

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 16px Poppins, sans-serif";
        ctx.fillStyle = "#363636";
        ctx.fillText(text, x, y);
        ctx.restore();
    },
};

Chart.register(dashedArcPlugin, centerTextPlugin);

const ENACTED_COLORS = [
    "rgba(72, 199, 142, 0.8)",  // green
    "rgba(38, 166, 112, 0.8)",
    "rgba(100, 210, 160, 0.8)",
    "rgba(50, 180, 130, 0.8)",
];

const APPROVED_COLORS = [
    "rgba(62, 142, 208, 0.8)",  // blue
    "rgba(90, 160, 220, 0.8)",
    "rgba(40, 120, 190, 0.8)",
    "rgba(110, 175, 230, 0.8)",
];

const FREE_COLOR = "rgba(240, 240, 240, 0.6)";

const fmtBalance = (v) => {
    if (v === 0) return "0";
    if (v >= 100) return Math.round(v).toString();
    return Number(v).toPrecision(4).replace(/\.?0+$/, "");
};

const SwapOptionPieChart = ({ currentBalance, activeOptions, proposals, assetLabel, nameMap = {} }) => {
    const chartData = useMemo(() => {
        // Active on-chain options (enacted, remaining allowance)
        const enactedTotal = activeOptions.reduce(
            (sum, o) => sum + (o.remainingAllowance || 0), 0
        );

        // Approved proposals (not yet enacted — will become options at next enactment)
        const approvedProposals = proposals.filter((p) => p.state === "Approved");
        const approvedTotal = approvedProposals.reduce(
            (sum, p) => sum + (p.allowance || 0), 0
        );

        // Proposed = Ongoing + Confirming (dashed arc, not a solid slice)
        const proposedProposals = proposals.filter(
            (p) => p.state === "Ongoing" || p.state === "Confirming"
        );
        const proposedTotal = proposedProposals.reduce(
            (sum, p) => sum + (p.allowance || 0), 0
        );

        const committed = enactedTotal + approvedTotal;
        const freeBalance = Math.max(0, currentBalance - committed);
        const isOverclaiming = committed + proposedTotal > currentBalance;
        const proposedFraction = currentBalance > 0
            ? proposedTotal / currentBalance
            : 0;

        // Build slices: enacted options + approved proposals + free balance
        const labels = [];
        const data = [];
        const colors = [];

        const dn = (addr) => {
            if (!addr) return null;
            return nameMap[addr] || addr.slice(0, 8) + "...";
        };

        [...activeOptions]
            .sort((a, b) => (b.remainingAllowance || 0) - (a.remainingAllowance || 0))
            .forEach((opt, i) => {
                const label = opt.beneficiary
                    ? `Active: ${dn(opt.beneficiary)}`
                    : `Active option ${i + 1}`;
                labels.push(label);
                data.push(opt.remainingAllowance || 0);
                colors.push(ENACTED_COLORS[i % ENACTED_COLORS.length]);
            });

        [...approvedProposals]
            .sort((a, b) => (b.allowance || 0) - (a.allowance || 0))
            .forEach((p, i) => {
            const label = p.beneficiary
                ? `Approved: ${dn(p.beneficiary)}`
                : `Approved #${p.id}`;
            labels.push(label);
            data.push(p.allowance || 0);
            colors.push(APPROVED_COLORS[i % APPROVED_COLORS.length]);
        });

        labels.push("Free");
        data.push(freeBalance);
        colors.push(FREE_COLOR);

        return {
            chartData: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderWidth: 1,
                    borderColor: "#fff",
                }],
            },
            proposedFraction,
            isOverclaiming,
            proposedTotal,
        };
    }, [currentBalance, activeOptions, proposals, nameMap]);

    const options = {
        cutout: "55%",
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
                labels: { font: { size: 11, family: "Poppins" } },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.label}: ${ctx.parsed.toFixed(4)} ${assetLabel}`,
                },
            },
            centerText: {
                text: `${fmtBalance(currentBalance)} ${assetLabel}`,
            },
            dashedArc: {
                proposedFraction: chartData.proposedFraction,
                isOverclaiming: chartData.isOverclaiming,
            },
        },
    };

    return (
        <div>
            <Doughnut data={chartData.chartData} options={options} />
            {chartData.proposedTotal > 0 && (
                <p className={`has-text-centered is-size-7 mt-2 ${chartData.isOverclaiming ? "has-text-danger" : "has-text-warning-dark"}`}>
                    Proposed: {chartData.proposedTotal.toFixed(4)} {assetLabel}
                    {chartData.isOverclaiming && " (overclaiming!)"}
                </p>
            )}
        </div>
    );
};

export default SwapOptionPieChart;
