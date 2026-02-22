import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ProposalStatsChart = ({ proposals }) => {
    const labels = proposals.map((p) => `#${p.id}`);
    const thresholdAbsolute = proposals.map(
        (p) => (p.thresholdPct / 100) * p.turnout
    );

    return (
        <div>
            <Scatter
                data={{
                    labels,
                    datasets: [
                        {
                            type: "bar",
                            label: "Electorate",
                            data: proposals.map((p) => p.electorateSize),
                            backgroundColor: "rgba(180, 180, 180, 0.5)",
                            borderColor: "rgba(180, 180, 180, 1)",
                            borderWidth: 1,
                            yAxisID: "y0",
                        },
                        {
                            type: "bar",
                            label: "Turnout",
                            data: proposals.map((p) => p.turnout),
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1,
                            yAxisID: "y0",
                        },
                        {
                            type: "bar",
                            label: "Ayes",
                            data: proposals.map((p) => p.ayes),
                            backgroundColor: "rgba(75, 192, 75, 0.6)",
                            borderColor: "rgba(75, 192, 75, 1)",
                            borderWidth: 1,
                            yAxisID: "y0",
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
                            yAxisID: "y0",
                        },
                    ],
                }}
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
                                text: "Proposal",
                                display: true,
                                font: { size: 15, family: "Poppins" },
                            },
                            ticks: {
                                font: { size: 13, family: "Poppins" },
                            },
                        },
                        y0: {
                            beginAtZero: true,
                            position: "left",
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
