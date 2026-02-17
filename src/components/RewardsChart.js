import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { apiGet } from "../api";
import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const RewardsChart = ({ cid }) => {
    Chart.register(...registerables);
    const [data, setData] = useState("");
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (cid) {
                const res = await apiGet(`accounting/rewards-data?&cid=${cid}`);
                if (res.status === 403) {
                    setShowSpinner(false);
                    alert("Access denied. Please log in again.");
                    return;
                }

                if (res.ok) {
                    const reportData = await res.json();
                    setShowSpinner(false);
                    setData(reportData);
                }
            }
        };
        fetchData().catch(console.error);
    }, [cid]);
    return (
        <div>
            {showSpinner && <Spinner />}
            {Object.keys(data).length !== 0 && (
                <Scatter
                    data={{
                        labels: Object.keys(data.data),
                        datasets: [
                            {
                                type: "line",
                                label: "# Participants",
                                data: Object.values(data.data).map(
                                    (e) => e.numParticipants
                                ),
                                fill: false,
                                borderColor: "rgba(232, 143, 107)",
                                backgroundColor: "rgba(232, 143, 107)",
                                yAxisID: "y0",
                            },
                            {
                                type: "line",
                                label: "Total Rewards",
                                data: Object.values(data.data).map(
                                    (e) => e.totalRewards
                                ),
                                fill: false,
                                borderColor: "rgba(107, 196, 232)",
                                backgroundColor: "rgba(107, 196, 232)",
                                yAxisID: "y1",
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            title: {
                                text: "Rewards Summary",
                                display: false,
                            },
                            legend: {
                                labels: {
                                    // This more specific font property overrides the global property
                                    font: {
                                        size: 13,
                                        family: "Poppins",
                                    },
                                },
                            },
                        },
                        scales: {
                            x: {
                                type: "category",
                                stacked: true,
                                title: {
                                    text: "Cycle Index",
                                    display: true,
                                    font: {
                                        size: 15,
                                        family: "Poppins",
                                    },
                                },
                                ticks: {
                                    font: {
                                        size: 13,
                                        family: "Poppins",
                                    },
                                },
                            },
                            y0: {
                                beginAtZero: true,
                                stacked: true,
                                position: "left",
                                title: {
                                    text: "# Particiants",
                                    display: true,
                                    font: {
                                        size: 15,
                                        family: "Poppins",
                                    },
                                },
                                type: "linear",
                            },
                            y1: {
                                beginAtZero: true,
                                stacked: true,
                                position: "right",
                                title: {
                                    text: "Total Rewards",
                                    display: true,
                                    font: {
                                        size: 15,
                                        family: "Poppins",
                                    },
                                },
                                type: "linear",
                            },
                        },
                    }}
                ></Scatter>
            )}
        </div>
    );
};

export default RewardsChart;
