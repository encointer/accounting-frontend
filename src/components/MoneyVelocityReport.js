import { useEffect, useState } from "react";
import {
    downloadDataUrl,
    getMoneyVelocityReportCsv,
    getMonthName,
} from "../util";
import Spinner from "./Spinner";
import InternalLayout from "./InternalLayout";
import { apiGet } from "../api";
import CidYearForm from "./CidYearForm";
import MoneyVelocityChart from "./MoneyVelocityChart";

const MoneyVelocityReport = () => {
    const useTotalVolumeForCommunities = ['kygch5kVGq7']

    const [data, setData] = useState({});
    const [communityName, setCommunityName] = useState("");
    const [year, setYear] = useState("");
    const [cid, setCid] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);
    const [useTotalVolume, setUseTotalVolume] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (cid && year) {
                const res = await apiGet(
                    `accounting/money-velocity-report?&cid=${cid}&year=${year}&useTotalVolume=${useTotalVolume}`
                );
                if (res.status === 403) {
                    setShowSpinner(false);
                    alert("Access denied. Please log in again.");
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    setShowSpinner(false);
                    setCommunityName(data.communityName);

                    const reportData = {};
                    Object.entries(data.data)
                        .sort(([k, v], [k2, v2]) => k - k2)
                        .forEach(
                            ([key, val]) =>
                                (reportData[getMonthName(key)] = val)
                        );
                    setData(reportData);
                }
            }
        };
        fetchData().catch(console.error);
    }, [cid, year, useTotalVolume]);

    const handleDownloadReport = async () => {
        const csv = getMoneyVelocityReportCsv(data);
        const filename = `MoneyVelocityReport_${communityName}_${year}`;
        const dataUrl = window.URL.createObjectURL(
            new Blob([csv], { type: "text/csv" })
        );

        downloadDataUrl(dataUrl, filename);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setData({});
        setShowSpinner(true);
        const cid = e.target.form.cid.value
        setUseTotalVolume(useTotalVolumeForCommunities.includes(cid));
        setCid(cid);
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
                    >{`Money Velocity at ${communityName} ${year}${useTotalVolume ?' (using total volume)' : ''}`}</p>
                    <MoneyVelocityChart
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

export default MoneyVelocityReport;
