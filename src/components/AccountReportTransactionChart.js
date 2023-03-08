import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const AccountReportTransactionChart = ({ data }) => {
    Chart.register(...registerables);

    return (
        <Scatter
            data={{
                labels: data.data.map((e) => e.month),
                datasets: [
                    {
                        type: "line",
                        label: "Number of customers",
                        data: data.data.map((e) => e.numDistinctClients),
                        fill: false,
                        borderColor: "rgba(232, 143, 107)",
                        backgroundColor: "rgba(232, 143, 107)",
                        yAxisID: "y",
                        order: 0,
                        stack: "Stack 1",
                    },
                    {
                        type: "line",
                        label: "Number of transactions",
                        data: data.data.map((e) => e.numIncoming),
                        fill: false,
                        borderColor: "rgba(107, 196, 232)",
                        backgroundColor: "rgba(107, 196, 232)",
                        yAxisID: "y",
                        order: 0,
                        stack: "Stack 2",
                    },
                ],
            }}
            options={{
                plugins: {
                    title: {
                        text: "Transaction Summary",
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
                        stacked: true,
                        position: "left",
                        title: {
                            text: "# Customers/Transactions",
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

export default AccountReportTransactionChart;
