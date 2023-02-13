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
                        borderColor: "rgb(255, 99, 132, 0.4)",
                        backgroundColor: "rgba(107, 196, 232, 0.4)",
                        yAxisID: "y",
                        order: 2,
                        stack: "Stack 0",
                    },

                    {
                        type: "bar",
                        label: "Balance-Revenue",
                        data: data.data.map((e) =>
                            round(e.balance - e.sumIncoming)
                        ),
                        fill: false,
                        borderColor: "rgba(70, 130, 153, 0.4)",
                        backgroundColor: "rgba(70, 130, 153, 0.4)",
                        yAxisID: "y",
                        stack: "Stack 0",
                        order: 1,
                    },

                    {
                        type: "line",
                        label: "Number of customers",
                        data: data.data.map((e) => e.numDistinctClients),
                        fill: false,
                        borderColor: "rgba(232, 143, 107)",
                        backgroundColor: "rgba(232, 143, 107)",
                        yAxisID: "y1",
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
                        yAxisID: "y1",
                        order: 0,
                        stack: "Stack 2",
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
                        // disable the hiding of the revenue bar chart
                        // as the balance without the stacked revenue is
                        // not meaningful data
                        onClick: function (e, legendItem) {
                            if (legendItem.text === "Revenue") {
                                e.stopPropagation();
                                return;
                            }
                            var index = legendItem.datasetIndex;
                            var ci = this.chart;
                            var meta = ci.getDatasetMeta(index);
                            meta.hidden =
                                meta.hidden === null
                                    ? !ci.data.datasets[index].hidden
                                    : null;
                            ci.update();
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
                        type: "linear",
                        title: {
                            text: "Revenue/Balance",
                            display: true,
                            font: {
                                size: 15,
                                family: "Poppins",
                            },
                        },
                    },
                    y1: {
                        beginAtZero: true,
                        stacked: true,
                        position: "right",
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

export default AccountReportChart;
