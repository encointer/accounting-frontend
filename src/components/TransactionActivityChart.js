import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const TransactionActivityChart = ({ data }) => {
    Chart.register(...registerables);
    return (
        <div>
            {Object.keys(data).length !== 0 && (
                <Scatter
                    data={{
                        labels: data.map((e) => e.month),
                        datasets: [
                            {
                                type: "bar",
                                label: "Personal",
                                data: data.map(
                                    (e) => e.personalTransactionCount
                                ),
                                fill: false,
                                yAxisID: "y0",
                            },
                            {
                                type: "bar",
                                label: "Governance",
                                data: data.map((e) => e.govTransactionCount),
                                fill: false,
                                yAxisID: "y0",
                            },
                            {
                                type: "bar",
                                label: "Vouchers",
                                data: data.map(
                                    (e) => e.voucherTransactionCount
                                ),
                                fill: false,
                                yAxisID: "y0",
                            },
                            {
                                type: "bar",
                                label: "Acceptance Points",
                                data: data.map(
                                    (e) => e.acceptancePointTransactionCount
                                ),
                                fill: false,
                                yAxisID: "y0",
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            title: {
                                text: "Transaction Activity",
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
                            y0: {
                                beginAtZero: true,
                                stacked: true,
                                position: "left",
                                title: {
                                    text: "Transaction Activity",
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

export default TransactionActivityChart;
