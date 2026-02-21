import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const CircularityChart = ({ data, label = "Circularity Index", yLabel = "Circularity (0\u20131)", color = "rgba(50, 115, 220)", yMax }) => {
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
                                label,
                                data: Object.values(data),
                                fill: false,
                                borderColor: color,
                                backgroundColor: color,
                                yAxisID: "y0",
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            title: {
                                text: label,
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
                                ...(yMax !== undefined && { max: yMax }),
                                position: "left",
                                title: {
                                    text: yLabel,
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
