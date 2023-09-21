import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const ReputablesByCindexChart = ({ data }) => {
    Chart.register(...registerables);

    const regress = (x, y) => {
        const n = y.length;
        let sx = 0;
        let sy = 0;
        let sxy = 0;
        let sxx = 0;
        let syy = 0;
        for (let i = 0; i < n; i++) {
            sx += x[i];
            sy += y[i];
            sxy += x[i] * y[i];
            sxx += x[i] * x[i];
            syy += y[i] * y[i];
        }
        const mx = sx / n;
        const my = sy / n;
        const yy = n * syy - sy * sy;
        const xx = n * sxx - sx * sx;
        const xy = n * sxy - sx * sy;
        const slope = xy / xx;
        const intercept = my - slope * mx;
        const r = xy / Math.sqrt(xx * yy);
        const r2 = Math.pow(r,2);
        let sst = 0;
        for (let i = 0; i < n; i++) {
           sst += Math.pow((y[i] - my), 2);
        }
        const sse = sst - r2 * sst;
        const see = Math.sqrt(sse / (n - 2));
        const ssr = sst - sse;
        return {slope, intercept, r, r2, sse, ssr, sst, sy, sx, see};
    }

    function f(x, slope, intercept) {
        return intercept + x * slope
    }
    const numCycles = 9;
    const maxCindex = Math.max(...Object.keys(data));
    const offset = (maxCindex - numCycles)
    const regressionData = Object.fromEntries(
        Object.entries(data).filter(([key, val]) => key >= offset)
    );
    const lr = regress(Object.keys(regressionData).map(e => e - offset), Object.values(regressionData));

    const trendlineData = {...data}
    Object.keys(trendlineData).forEach(k => {
        console.log(k)
        console.log(offset)
        k = parseInt(k)
        if(k === maxCindex) trendlineData[k] = f(maxCindex - offset, lr.slope, lr.intercept)
        else if (k === maxCindex - numCycles) trendlineData[k] = f(0, lr.slope, lr.intercept)
    else {trendlineData[k] = null}
    })
    const newReputablesTrend = (trendlineData[maxCindex] - trendlineData[maxCindex - numCycles]) / numCycles;
    
    return (
        <div>
            {Object.keys(data).length !== 0 && (
                <Scatter
                    data={{
                        labels: Object.keys(data),
                        datasets: [
                            {
                                type: "line",
                                label: "#Reputables",
                                data: Object.values(data),
                                fill: false,
                                borderColor: "rgba(232, 143, 107)",
                                backgroundColor: "rgba(232, 143, 107)",
                                yAxisID: "y0",
                            },
                            {
                                type: "line",
                                label: "Trend",
                                data: Object.values(trendlineData),
                                yAxisID: "y0",
                                spanGaps: true,
                                borderColor: "black",
                                backgroundColor: "black",
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            title: {
                                text: `Trend: ${Math.round(newReputablesTrend * 100) / 100} new reputables per cycle`,
                                display: true,
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
                                stacked: false,
                                title: {
                                    text: "Cindex",
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
                                stacked: false,
                                position: "left",
                                title: {
                                    text: "# Reputables",
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

export default ReputablesByCindexChart;
