import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ProposalStatsChart = ({ proposals }) => {
    // Reverse so newest is on top
    const sorted = [...proposals].reverse();
    const labels = sorted.map((p) => `#${p.id}`);
    const thresholdAbsolute = sorted.map(
        (p) => (p.thresholdPct / 100) * p.turnout
    );

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <Scatter
                data={{
                    labels,
                    datasets: [
                        {
                            type: "bar",
                            label: "Electorate",
                            data: sorted.map((p) => p.electorateSize),
                            backgroundColor: "rgba(180, 180, 180, 0.5)",
                            borderColor: "rgba(180, 180, 180, 1)",
                            borderWidth: 1,
                            xAxisID: "x0",
                            indexAxis: "y",
                        },
                        {
                            type: "bar",
                            label: "Turnout",
                            data: sorted.map((p) => p.turnout),
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1,
                            xAxisID: "x0",
                            indexAxis: "y",
                        },
                        {
                            type: "bar",
                            label: "Ayes",
                            data: sorted.map((p) => p.ayes),
                            backgroundColor: "rgba(75, 192, 75, 0.6)",
                            borderColor: "rgba(75, 192, 75, 1)",
                            borderWidth: 1,
                            xAxisID: "x0",
                            indexAxis: "y",
                        },
                        {
                            type: "line",
                            label: "AQB Threshold",
                            data: thresholdAbsolute,
                            borderColor: "rgba(255, 99, 132, 1)",
                            backgroundColor: "rgba(255, 99, 132, 0.1)",
                            borderWidth: 2,
                            borderDash: [5, 5],
                            pointRadius: 4,
                            fill: false,
                            xAxisID: "x0",
                            indexAxis: "y",
                        },
                    ],
                }}
                options={{
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            labels: {
                                font: { size: 13, family: "Poppins" },
                            },
                        },
                    },
                    scales: {
                        y: {
                            type: "category",
                            title: {
                                text: "Proposal",
                                display: true,
                                font: { size: 15, family: "Poppins" },
                            },
                            ticks: {
                                font: { size: 13, family: "Poppins" },
                            },
                        },
                        x0: {
                            beginAtZero: true,
                            position: "bottom",
                            title: {
                                text: "Vote Count",
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

export default ProposalStatsChart;
