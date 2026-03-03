import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(...registerables, annotationPlugin);

const SwapOptionTimeline = ({
    currentBalance,
    activeOptions,
    proposals,
    events,
    nextEnactmentTimestamp,
    assetLabel,
}) => {
    const { datasets, annotations, xMin, xMax } = useMemo(() => {
        if (!events || events.length === 0) {
            return { datasets: [], annotations: {}, xMin: Date.now() - 86400000, xMax: Date.now() + 86400000 };
        }

        // Build running balance from events
        const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
        const balancePoints = [];
        let balance = 0;

        for (const evt of sorted) {
            if (evt.type === "topup") {
                balance += evt.amount;
            } else if (evt.type === "spend") {
                balance -= evt.amount;
            }
            // option_granted events are annotations, not balance changes
            if (evt.type !== "option_granted") {
                balancePoints.push({ x: evt.timestamp, y: balance });
            }
        }

        // Add current point (verified balance)
        const now = Date.now();
        balancePoints.push({ x: now, y: currentBalance });

        // Historical balance line
        const balanceDataset = {
            label: `${assetLabel} Balance`,
            data: balancePoints,
            borderColor: "rgba(62, 142, 208, 1)",
            backgroundColor: "rgba(62, 142, 208, 0.1)",
            fill: true,
            stepped: "before",
            pointRadius: 1,
            borderWidth: 2,
        };

        const allDatasets = [balanceDataset];

        // Committed (active options) — flat line from now
        const committedTotal = activeOptions.reduce(
            (sum, o) => sum + (o.remainingAllowance || 0), 0
        );

        // Future: approved proposals (Approved state in proposals)
        const approvedProposals = proposals.filter((p) => p.state === "Approved");
        const approvedTotal = approvedProposals.reduce(
            (sum, p) => sum + (p.allowance || 0), 0
        );

        // Future: proposed (Ongoing/Confirming)
        const proposedProposals = proposals.filter(
            (p) => p.state === "Ongoing" || p.state === "Confirming"
        );
        const proposedTotal = proposedProposals.reduce(
            (sum, p) => sum + (p.allowance || 0), 0
        );

        // Extrapolation: committed line from now into future
        const futureEnd = now + 90 * 86400000; // 90 days ahead

        if (committedTotal > 0) {
            allDatasets.push({
                label: `Committed (active options)`,
                data: [
                    { x: now, y: committedTotal },
                    { x: futureEnd, y: committedTotal },
                ],
                borderColor: "rgba(72, 199, 142, 0.8)",
                backgroundColor: "rgba(72, 199, 142, 0.15)",
                fill: true,
                borderWidth: 2,
                pointRadius: 0,
                borderDash: [],
            });
        }

        // Approved: step up at enactment time
        const enactTime = nextEnactmentTimestamp || now + 7 * 86400000;
        if (approvedTotal > 0) {
            allDatasets.push({
                label: `Approved (pending enactment)`,
                data: [
                    { x: enactTime, y: committedTotal },
                    { x: enactTime, y: committedTotal + approvedTotal },
                    { x: futureEnd, y: committedTotal + approvedTotal },
                ],
                borderColor: "rgba(62, 142, 208, 0.7)",
                borderWidth: 2,
                borderDash: [6, 3],
                pointRadius: 0,
                fill: false,
            });
        }

        // Proposed: lighter dashed step after approved
        if (proposedTotal > 0) {
            const proposedStart = approvedTotal > 0 ? enactTime + 7 * 86400000 : enactTime;
            const allCommitted = committedTotal + approvedTotal + proposedTotal;
            const isOverclaiming = allCommitted > currentBalance;
            allDatasets.push({
                label: `Proposed${isOverclaiming ? " (overclaiming!)" : ""}`,
                data: [
                    { x: proposedStart, y: committedTotal + approvedTotal },
                    { x: proposedStart, y: allCommitted },
                    { x: futureEnd, y: allCommitted },
                ],
                borderColor: isOverclaiming ? "rgba(255, 60, 60, 0.7)" : "rgba(255, 165, 0, 0.7)",
                borderWidth: 2,
                borderDash: [4, 4],
                pointRadius: 0,
                fill: false,
            });
        }

        // Annotations
        const anns = {
            nowLine: {
                type: "line",
                xMin: now,
                xMax: now,
                borderColor: "rgba(0, 0, 0, 0.3)",
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                    display: true,
                    content: "Now",
                    position: "start",
                    font: { size: 10, family: "Poppins" },
                },
            },
        };

        // Option granted event markers
        const grantedEvents = events.filter((e) => e.type === "option_granted");
        grantedEvents.forEach((evt, i) => {
            anns[`grant_${i}`] = {
                type: "point",
                xValue: evt.timestamp,
                yValue: 0,
                backgroundColor: "rgba(156, 109, 217, 0.7)",
                radius: 4,
            };
        });

        if (nextEnactmentTimestamp && approvedTotal > 0) {
            anns.enactmentLine = {
                type: "line",
                xMin: enactTime,
                xMax: enactTime,
                borderColor: "rgba(62, 142, 208, 0.4)",
                borderWidth: 1,
                borderDash: [3, 3],
                label: {
                    display: true,
                    content: "Enactment",
                    position: "start",
                    font: { size: 10, family: "Poppins" },
                },
            };
        }

        const timestamps = balancePoints.map((p) => p.x);
        return {
            datasets: allDatasets,
            annotations: anns,
            xMin: Math.min(...timestamps),
            xMax: futureEnd,
        };
    }, [currentBalance, activeOptions, proposals, events, nextEnactmentTimestamp, assetLabel]);

    if (events.length === 0) {
        return <p className="has-text-grey is-size-7">No treasury events found.</p>;
    }

    return (
        <Line
            data={{ datasets }}
            options={{
                responsive: true,
                interaction: { mode: "nearest", intersect: false },
                scales: {
                    x: {
                        type: "linear",
                        min: xMin,
                        max: xMax,
                        ticks: {
                            callback: (val) => new Date(val).toLocaleDateString(),
                            font: { size: 10, family: "Poppins" },
                            maxTicksLimit: 8,
                        },
                        title: { display: true, text: "Date", font: { size: 12, family: "Poppins" } },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: assetLabel,
                            font: { size: 12, family: "Poppins" },
                        },
                        ticks: { font: { size: 10, family: "Poppins" } },
                    },
                },
                plugins: {
                    legend: {
                        labels: { font: { size: 11, family: "Poppins" } },
                    },
                    tooltip: {
                        callbacks: {
                            title: (items) => {
                                if (items.length > 0) {
                                    return new Date(items[0].parsed.x).toLocaleDateString();
                                }
                                return "";
                            },
                            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(4)} ${assetLabel}`,
                        },
                    },
                    annotation: { annotations },
                },
            }}
        />
    );
};

export default SwapOptionTimeline;
