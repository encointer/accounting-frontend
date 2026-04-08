import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const COLORS = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728",
    "#9467bd", "#8c564b", "#e377c2", "#7f7f7f",
];

const ACTION_LABELS = {
    spendNative: "SpendNative",
    issueSwapAssetOption: "IssueSwapAssetOption",
    issueSwapNativeOption: "IssueSwapNativeOption",
    updateNominalIncome: "UpdateNominalIncome",
    updateDemurrage: "UpdateDemurrage",
    addLocation: "AddLocation",
    removeLocation: "RemoveLocation",
    updateCommunityMetadata: "UpdateMetadata",
    setInactivityTimeout: "SetInactivityTimeout",
    petition: "Petition",
};

const ProposalTimelineChart = ({ proposals }) => {
    const datasets = useMemo(() => {
        const byType = {};
        for (const p of proposals) {
            if (!p.start || !p.actionType) continue;
            if (!byType[p.actionType]) byType[p.actionType] = [];
            byType[p.actionType].push(p.start);
        }

        return Object.entries(byType)
            .map(([type, timestamps], i) => {
                timestamps.sort((a, b) => a - b);
                return {
                    label: `${ACTION_LABELS[type] || type} (n=${timestamps.length})`,
                    data: timestamps.map((ts, j) => ({ x: ts, y: j + 1 })),
                    borderColor: COLORS[i % COLORS.length],
                    backgroundColor: COLORS[i % COLORS.length],
                    borderWidth: 2,
                    pointRadius: 0,
                    stepped: "after",
                    fill: false,
                };
            });
    }, [proposals]);

    if (datasets.length === 0) return null;

    return (
        <Line
            data={{ datasets }}
            options={{
                parsing: false,
                plugins: {
                    legend: {
                        labels: { font: { size: 13, family: "Poppins" } },
                    },
                    tooltip: {
                        callbacks: {
                            title: (items) => {
                                const ts = items[0].parsed.x;
                                const date = new Date(ts);
                                const dd = String(date.getUTCDate()).padStart(2, "0");
                                const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
                                const yyyy = date.getUTCFullYear();
                                return `${dd}.${mm}.${yyyy}`;
                            },
                            label: (item) => `${item.dataset.label.split(" (")[0]}: ${item.parsed.y}`,
                        },
                    },
                },
                scales: {
                    x: {
                        type: "linear",
                        title: {
                            text: "Date",
                            display: true,
                            font: { size: 15, family: "Poppins" },
                        },
                        ticks: {
                            font: { size: 11, family: "Poppins" },
                            callback: (value) => {
                                const d = new Date(value);
                                return d.toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                    timeZone: "UTC",
                                });
                            },
                            maxTicksLimit: 8,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            text: "Cumulative Count",
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

export default ProposalTimelineChart;
