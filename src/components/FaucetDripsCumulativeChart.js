import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const COLORS = [
    "rgba(31, 119, 180, 0.7)",
    "rgba(255, 127, 14, 0.7)",
    "rgba(44, 160, 44, 0.7)",
    "rgba(214, 39, 40, 0.7)",
    "rgba(148, 103, 189, 0.7)",
    "rgba(140, 86, 75, 0.7)",
    "rgba(227, 119, 194, 0.7)",
    "rgba(127, 127, 127, 0.7)",
    "rgba(188, 189, 34, 0.7)",
    "rgba(23, 190, 207, 0.7)",
];

const FaucetDripsCumulativeChart = ({
    months,
    cumulative,
    communities,
    uniqueDrippers,
}) => {
    Chart.register(...registerables);

    const datasets = communities.map((community, i) => ({
        type: "line",
        label: `${community} (${uniqueDrippers[community] || 0})`,
        data: cumulative[community],
        fill: true,
        borderColor: COLORS[i % COLORS.length],
        backgroundColor: COLORS[i % COLORS.length],
    }));

    return (
        <Scatter
            data={{ labels: months, datasets }}
            options={{
                plugins: {
                    title: {
                        text: "Cumulative Faucet Drips per Community",
                        display: true,
                        font: { size: 16, family: "Poppins" },
                    },
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
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        title: {
                            text: "Cumulative Drips",
                            display: true,
                            font: { size: 15, family: "Poppins" },
                        },
                    },
                },
            }}
        />
    );
};

export default FaucetDripsCumulativeChart;
