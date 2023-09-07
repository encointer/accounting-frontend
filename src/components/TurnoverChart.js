import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const TurnoverChart = ({ rows, header, volumes }) => {
    Chart.register(...registerables);
    return (
        <div>
            {rows.length !== 0 && (
                <Scatter
                    data={{
                        labels: header,
                        datasets: rows
                            .slice(0, -1)
                            .map((r) => ({
                                type: "bar",
                                label: r[0],
                                data: r.slice(1),
                                fill: false,
                            }))
                            .concat([
                                {
                                    type: "line",
                                    label: 'Total Volume',
                                    data: volumes,
                                },
                            ]),
                    }}
                    options={{
                        plugins: {
                            title: {
                                text: "Turnover",
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
                                    text: "Turnover",
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

export default TurnoverChart;
