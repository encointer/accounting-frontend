import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { round } from "../util";

const AccountReportChart = ({ data }) => {
    Chart.register(...registerables);

    console.log(data);
    return (
        <Scatter
            data={{
                labels: data.data.map((e) => e.month),
                datasets: [
                    {
                        type: "bar",
                        label: "Revenue",
                        data: data.data.map((e) => round(e.sumIncoming)),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(107, 196, 232, 0.3)",
                        yAxisID: "y",
                        order: 1,
                    },
                    {
                        type: "line",
                        label: "Number of customers",
                        data: data.data.map((e) => e.numDistinctClients),
                        fill: false,
                        borderColor: "rgba(107, 196, 232)",
                        backgroundColor: "rgba(107, 196, 232)",
                        yAxisID: "y1",
                    },
                    {
                        type: "line",
                        label: "Number of transactions",
                        data: data.data.map((e) => e.numIncoming),
                        fill: false,
                        borderColor: "#E88F6B",
                        backgroundColor: "#E88F6B",
                        yAxisID: "y1",
                    },
                ],
            }}
            options={{
                plugins: {
                    title: {
                        text: "Revenue/Transaction Summary",
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
                        title: {
                            text: "Month",
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

                    y: {
                        beginAtZero: true,
                        type: "linear",
                        title: {
                            text: "Revenue",
                            display: true,
                            font: {
                                size: 15,
                                family: "Poppins",
                            },
                        },
                    },
                    y1: {
                        beginAtZero: true,
                        position: "right",
                        title: {
                            text: "# customers/transactions",
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
    );
};

export default AccountReportChart;
