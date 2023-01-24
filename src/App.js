import "bulma/css/bulma.min.css";
import { useEffect, useState } from "react";
import AddressForm from "./components/AddressForm";
import Layout from "./components/Layout";
import SummaryLogWRow from "./components/SummaryLogRow";
import { downloadDataUrl } from "./util";
import { getReport } from "./report";
import { summaryLogFields } from "./consts";

const App = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(
                "http://localhost:8081/get-accounting-data?&account=HhuYrWaBKfqB4HbEVdLUHWEPM6TE7cSe9tQsf8reRuvN4vk&cid=u0qj944rhWE&token=abc"
            );
            const reportData = await res.json();
            reportData.data = [
                reportData.data[0],
                reportData.data[0],
                reportData.data[0],
                reportData.data[0],
                reportData.data[0],
            ]
            setData(reportData);
        };
        fetchData().catch(console.error);
    });

    const handleSummaryLogDownlaod = () => {
        const report = getReport(
            data
        );
        downloadDataUrl(report.output("datauristring"), "doc.pdf");
    };

    if (Object.keys(data).length !== 0) {
        return (
            <Layout>
                <div className="container">
                    <AddressForm />
                    <br />
                    <br />
                    <br />
                    <table className="table">
                        <thead>
                            <tr>
                                {summaryLogFields.map((val, i) => (
                                    <th key={i}>{val}</th>
                                ))}
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.map((row, i) => (
                                <SummaryLogWRow {...row} key={i} />
                            ))}
                        </tbody>
                    </table>
                    <button
                        className="button is-link"
                        onClick={handleSummaryLogDownlaod}
                    >
                        Download Summary Log
                    </button>
                </div>
            </Layout>
        );
    }
};

export default App;
