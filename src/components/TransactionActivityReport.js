import { useEffect, useState } from "react";
import {
    downloadDataUrl,
    getMonthName,
    getTransactionActivityReportCsv,
} from "../util";
import Spinner from "./Spinner";
import InternalLayout from "./InternalLayout";
import { apiGet } from "../api";
import CidYearForm from "./CidYearForm";
import TransactionActivityChart from "./TransactionActivityChart";

const TransactionActivityReport = () => {
    const [data, setData] = useState({});
    const [communityName, setCommunityName] = useState("");
    const [year, setYear] = useState("");
    const [cid, setCid] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (cid && year) {
                const res = await apiGet(
                    `accounting/transaction-activity?&cid=${cid}&year=${year}`
                );
                if (res.status === 403) {
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    setShowSpinner(false);
                    setCommunityName(data.communityName);

                    data.data
                        .sort((a, b) => a.month - b.month)
                        .forEach((e) => (e.month = getMonthName(e.month)));
                    setData(data.data);
                }
            }
        };
        fetchData().catch(console.error);
    }, [cid, year]);

    const handleDownloadReport = async () => {
        const csv = getTransactionActivityReportCsv(data);
        const filename = `TransactionActiviyReport_${communityName}_${year}`;
        const dataUrl = window.URL.createObjectURL(
            new Blob([csv], { type: "text/csv" })
        );

        downloadDataUrl(dataUrl, filename);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setData({});
        setShowSpinner(true);
        setCid(e.target.form.cid.value);
        setYear(e.target.form.year.value);
    };

    return (
        <InternalLayout>
            <CidYearForm handleSubmit={handleSubmitForm} />
            <br />
            <br />
            {showSpinner && <Spinner />}
            {Object.keys(data).length !== 0 && (
                <div>
                    <p
                        style={{ fontSize: "3.5vh" }}
                    >{`Transaction Activity by recipient type at ${communityName} ${year}`}</p>
                    <br />
                    <br />
                    <TransactionActivityChart
                        communityName={communityName}
                        year={year}
                        data={data}
                    />
                    <button
                        className="button is-link"
                        onClick={handleDownloadReport}
                    >
                        Download Report
                    </button>
                </div>
            )}
        </InternalLayout>
    );
};

export default TransactionActivityReport;
