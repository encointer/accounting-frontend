import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const COLORS = [
    "rgba(31, 119, 180, 1)",
    "rgba(255, 127, 14, 1)",
    "rgba(44, 160, 44, 1)",
    "rgba(214, 39, 40, 1)",
    "rgba(148, 103, 189, 1)",
    "rgba(140, 86, 75, 1)",
    "rgba(227, 119, 194, 1)",
    "rgba(127, 127, 127, 1)",
    "rgba(188, 189, 34, 1)",
    "rgba(23, 190, 207, 1)",
];

const FaucetDripsMonthlyChart = ({
    monthlyDrips,
    communities,
    uniqueDrippers,
}) => {
    Chart.register(...registerables);

    const months = Object.keys(monthlyDrips).sort();
    const datasets = communities.map((community, i) => ({
        type: "line",
        label: `${community} (${uniqueDrippers[community] || 0})`,
        data: months.map((m) => ({
            x: m,
            y: monthlyDrips[m]?.[community] || 0,
        })),
        fill: false,
        borderColor: COLORS[i % COLORS.length],
        backgroundColor: COLORS[i % COLORS.length],
        pointRadius: 3,
    }));

    return (
        <Scatter
            data={{ labels: months, datasets }}
            options={{
                plugins: {
                    title: {
                        text: "Faucet Drips per Month per Community",
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
                        title: {
                            text: "Drips",
                            display: true,
                            font: { size: 15, family: "Poppins" },
                        },
                    },
                },
            }}
        />
    );
};

export default FaucetDripsMonthlyChart;
