import { Chart as ReactChart } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { SankeyController, Flow } from "chartjs-chart-sankey";

const SankeyChart = ({ data }) => {
    Chart.register(...registerables);
    Chart.register(SankeyController, Flow);

    const colors = {
        cii: "lightblue",
        biz: "blue",
        b2b: "orange",
        retail: "green",
        suppliers: "red",
        lea: "violet",
        unknown: "brown",
        demurrage: "pink",
    };
    const getColor = (key) => colors[key];

    const chartData = {
        datasets: [
            {
                label: "Sankey",
                data: [
                    { from: "cii", to: "biz", flow: data.ciiToBiz },
                    { from: "b2b", to: "biz", flow: data.b2bToBiz },
                    { from: "retail", to: "biz", flow: data.retailToBiz },
                    { from: "biz", to: "suppliers", flow: data.bizToSuppliers },
                    { from: "biz", to: "lea", flow: data.bizToLea },
                    { from: "biz", to: "unknown", flow: data.bizToUnknown },
                    { from: "biz", to: "demurrage", flow: data.bizToDemurrage },
                ].filter((e) => e.flow > 0),
                colorFrom: (c) => getColor(c.dataset.data[c.dataIndex].from),
                colorTo: (c) => getColor(c.dataset.data[c.dataIndex].to),
                colorMode: "gradient", // or 'from' or 'to'
                /* optional labels */
                labels: {
                    cii: "CII",
                    b2b: "B2B",
                    retail: "Retail",
                    biz: "Biz",
                    suppliers: "Suppliers",
                    lea: "Lea Buy Back",
                    unknown: "Unknown",
                    demurrage: "Demurrage",
                },
            },
        ],
    };

    return <ReactChart type="sankey" data={chartData} />;
};

export default SankeyChart;
