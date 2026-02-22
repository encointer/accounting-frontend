import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const seriesColors = {
    2: "rgba(50, 115, 220)",
    3: "rgba(232, 143, 107)",
    4: "rgba(35, 209, 96)",
    5: "rgba(184, 107, 255)",
};

/**
 * @param {{ labels: string[], series: Object<number, number[]> }} data
 * @param {string} labelPrefix - e.g. "Circularity" or "Volume"
 * @param {string} yLabel
 * @param {number} [yMax]
 */
const CircularityChart = ({ data, labelPrefix = "Circularity", yLabel = "Circularity (0\u20131)", yMax }) => {
    Chart.register(...registerables);
    if (!data || !data.labels?.length) return null;

    const datasets = Object.entries(data.series).map(([k, values]) => ({
        type: "line",
        label: `\u2265${k} nodes`,
        data: values,
        fill: false,
        borderColor: seriesColors[k] || "#888",
        backgroundColor: seriesColors[k] || "#888",
        borderWidth: k === "2" || k === 2 ? 2.5 : 1.5,
        pointRadius: 2,
        yAxisID: "y0",
    }));

    return (
        <div>
            <Scatter
                data={{ labels: data.labels, datasets }}
                options={{
                    plugins: {
                        legend: {
                            labels: {
                                font: { size: 13, family: "Poppins" },
                            },
                        },
                    },
                    scales: {
                        x: {
                            type: "category",
                            title: {
                                text: "Month",
                                display: true,
                                font: { size: 15, family: "Poppins" },
                            },
                            ticks: {
                                font: { size: 13, family: "Poppins" },
                            },
                        },
                        y0: {
                            beginAtZero: true,
                            ...(yMax !== undefined && { max: yMax }),
                            position: "left",
                            title: {
                                text: yLabel,
                                display: true,
                                font: { size: 15, family: "Poppins" },
                            },
                            type: "linear",
                        },
                    },
                }}
            />
        </div>
    );
};

export default CircularityChart;
