import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const CircularityChart = ({ data }) => {
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
                                label: "Circularity Index",
                                data: Object.values(data),
                                fill: false,
                                borderColor: "rgba(50, 115, 220)",
                                backgroundColor: "rgba(50, 115, 220)",
                                yAxisID: "y0",
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            title: {
                                text: "Circularity Index",
                                display: false,
                            },
                            legend: {
                                labels: {
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
                            y0: {
                                beginAtZero: true,
                                max: 1,
                                position: "left",
                                title: {
                                    text: "Circularity (0–1)",
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
                />
            )}
        </div>
    );
};

export default CircularityChart;
