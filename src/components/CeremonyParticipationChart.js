import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { apiGet } from "../api";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const COMMUNITIES = [
    { cid: "u0qj944rhWE", color: "#1f77b4" },
    { cid: "kygch5kVGq7", color: "#ff7f0e" },
    { cid: "s1vrqQL2SD", color: "#2ca02c" },
    { cid: "dpcmj33LUs9", color: "#d62728" },
];

const ANCHOR_CINDEX = 98;
const ANCHOR_DATE = new Date(Date.UTC(2024, 11, 2));
const CYCLE_DAYS = 10;

function cindexToDate(cindex) {
    const ms = ANCHOR_DATE.getTime() + (cindex - ANCHOR_CINDEX) * CYCLE_DAYS * 86400000;
    return new Date(ms);
}

function formatDate(date) {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

const CeremonyParticipationChart = () => {
    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allCindexes, setAllCindexes] = useState([]);
    const [dateTicks, setDateTicks] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            const results = await Promise.all(
                COMMUNITIES.map(async ({ cid, color }) => {
                    const res = await apiGet(`accounting/rewards-data?&cid=${cid}`);
                    if (!res.ok) return null;
                    const json = await res.json();
                    return { data: json.data, name: json.communityName, color };
                })
            );

            const built = [];
            const cindexSet = new Set();

            for (const r of results) {
                if (!r) continue;
                const cindexes = Object.keys(r.data).map(Number).sort((a, b) => a - b);
                cindexes.forEach((c) => cindexSet.add(c));
                const participants = cindexes.map((c) => r.data[String(c)].numParticipants);

                if (Math.max(...participants) < 3) continue;

                built.push({
                    label: r.name,
                    data: cindexes.map((c, i) => ({ x: c, y: participants[i] })),
                    borderColor: r.color,
                    backgroundColor: r.color,
                    pointRadius: 3,
                    borderWidth: 2,
                    fill: false,
                });
            }

            const sorted = [...cindexSet].sort((a, b) => a - b);
            setAllCindexes(sorted);

            if (sorted.length > 0) {
                const min = sorted[0];
                const max = sorted[sorted.length - 1];
                const ticks = [];
                for (let c = min; c <= max; c += 36) {
                    ticks.push(c);
                }
                if (ticks[ticks.length - 1] < max - 10) {
                    ticks.push(max);
                }
                setDateTicks(ticks);
            }

            setDatasets(built);
            setLoading(false);
        };
        fetchAll().catch(console.error);
    }, []);

    if (loading) return <Spinner />;
    if (datasets.length === 0) return null;

    return (
        <div style={{ position: "relative" }}>
            {dateTicks.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingLeft: 55,
                        paddingRight: 15,
                        fontSize: 11,
                        color: "#666",
                        fontFamily: "Poppins",
                    }}
                >
                    {dateTicks.map((c) => (
                        <span key={c}>{formatDate(cindexToDate(c))}</span>
                    ))}
                </div>
            )}
            <Line
                data={{ datasets }}
                options={{
                    parsing: false,
                    plugins: {
                        legend: {
                            labels: {
                                font: { size: 13, family: "Poppins" },
                            },
                        },
                        tooltip: {
                            callbacks: {
                                title: (items) => {
                                    const cindex = items[0].parsed.x;
                                    const date = cindexToDate(cindex);
                                    const dd = String(date.getUTCDate()).padStart(2, "0");
                                    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
                                    const yyyy = date.getUTCFullYear();
                                    return `Ceremony ${cindex} (${dd}.${mm}.${yyyy})`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            type: "linear",
                            title: {
                                text: "Ceremony Index",
                                display: true,
                                font: { size: 15, family: "Poppins" },
                            },
                            ticks: {
                                font: { size: 13, family: "Poppins" },
                                stepSize: 10,
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                text: "Participants Rewarded",
                                display: true,
                                font: { size: 15, family: "Poppins" },
                            },
                            ticks: {
                                font: { size: 13, family: "Poppins" },
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default CeremonyParticipationChart;
