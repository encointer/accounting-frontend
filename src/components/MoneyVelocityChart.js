import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const MoneyVelocityChart = ({ data }) => {
    Chart.register(...registerables);
    return (
        <div>
            {Object.keys(data).length !== 0 && (
                <Scatter
                    data={{
                        labels: Object.keys(data),
                        datasets: [
                            {
                                type: "line",
                                label: "Money Velocity",
                                data: Object.values(data),
                                fill: false,
                                borderColor: "rgba(232, 143, 107)",
                                backgroundColor: "rgba(232, 143, 107)",
                                yAxisID: "y0",
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            title: {
                                text: "Money Velocity",
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
                                    text: "Money Velocity",
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

export default MoneyVelocityChart;
