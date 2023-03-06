import { useEffect, useState } from "react";
import { downloadDataUrl, getMonthName, getTurnoverReportCsv } from "../util";
import Spinner from "./Spinner";
import CidForm from "./CidForm";
import TurnoverTable from "./TurnoverTable";
import InternalLayout from "./InternalLayout";
import { apiGet } from "../api";

const TurnoverReport = () => {
    const [header, setHeader] = useState([]);
    const [rows, setRows] = useState([]);
    const [communityName, setCommunityName] = useState("");
    const [year, setYear] = useState("");
    const [cid, setCid] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (cid) {
                const res = await apiGet(
                    `accounting/all-accounts-data?&cid=${cid}`
                );
                if (res.status === 403) {
                    return;
                }

                if (res.ok) {
                    const reportData = await res.json();
                    setShowSpinner(false);
                    setCommunityName(reportData.communityName);
                    setYear(reportData.year);

                    const displayData = {};

                    const header = reportData.data
                        .map((d) => d.name)
                        .concat("Total");

                    for (const businessData of reportData.data) {
                        for (const monthData of businessData.data) {
                            displayData[monthData.month] =
                                displayData[monthData.month] || {};
                            displayData[monthData.month][businessData.name] =
                                monthData.sumIncoming;
                        }
                    }
                    Object.values(displayData).forEach(
                        (monthItem) =>
                            (monthItem.Total = Object.values(monthItem).reduce(
                                (acc, cur) => acc + cur,
                                0
                            ))
                    );

                    const rows = [];
                    for (const [monthIndex, data] of Object.entries(
                        displayData
                    )) {
                        const row = [];
                        row.push(getMonthName(monthIndex));
                        for (const columnName of header) {
                            row.push(data[columnName]);
                        }
                        rows.push(row);
                    }

                    setRows(rows);
                    setHeader(header);
                }
            }
        };
        fetchData().catch(console.error);
    }, [cid]);

    const handleDownloadReport = async () => {
        const csv = getTurnoverReportCsv(header, rows);
        const filename = `TurnoverReport_${communityName}_${year}`;
        const dataUrl = window.URL.createObjectURL(
            new Blob([csv], { type: "text/csv" })
        );

        downloadDataUrl(dataUrl, filename);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setHeader([]);
        setShowSpinner(true);
        setCid(e.target.form.cid.value);
    };

    return (
        <InternalLayout>
            <CidForm handleSubmit={handleSubmitForm} />
            <br />
            <br />
            {showSpinner && <Spinner />}
            {Object.keys(header).length !== 0 && (
                <TurnoverTable
                    communityName={communityName}
                    year={year}
                    rows={rows}
                    header={header}
                    handleDownloadReport={handleDownloadReport}
                />
            )}
        </InternalLayout>
    );
};

export default TurnoverReport;
