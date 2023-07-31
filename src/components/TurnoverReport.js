import { useEffect, useState } from "react";
import {
    downloadDataUrl,
    getMonthName,
    getTurnoverReportCsv,
    round,
} from "../util";
import Spinner from "./Spinner";
import CidForm from "./CidForm";
import TurnoverTable from "./TurnoverTable";
import InternalLayout from "./InternalLayout";
import { apiGet } from "../api";
import CidYearForm from "./CidYearForm";

const TurnoverReport = () => {
    const [header, setHeader] = useState([]);
    const [rows, setRows] = useState([]);
    const [communityName, setCommunityName] = useState("");
    const [year, setYear] = useState("");
    const [cid, setCid] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (cid && year) {
                const res = await apiGet(
                    `accounting/all-accounts-data?&cid=${cid}&year=${year}`
                );
                if (res.status === 403) {
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    setShowSpinner(false);
                    setCommunityName(data.communityName);

                    const reportData = data.data;
                    reportData.forEach((item) =>
                        item.data.sort((a, b) => a.month - b.month)
                    );

                    const months = reportData[0].data.map((item) => item.month);
                    const header = months.map((month) => getMonthName(month));

                    const rows = reportData.map((row) =>
                        [row.name].concat(
                            months.map((month) =>
                                round(
                                    row.data.find(
                                        (item) => item.month === month
                                    ).sumIncoming
                                )
                            )
                        )
                    );
                    rows.push(
                        ["Total"].concat(
                            months.map((month) =>
                                round(
                                    reportData.reduce(
                                        (acc, cur) =>
                                            cur.data.find(
                                                (item) => item.month === month
                                            ).sumIncoming + acc,
                                        0
                                    )
                                )
                            )
                        )
                    );

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
        setYear(e.target.form.year.value);
    };

    return (
        <InternalLayout>
            <CidYearForm handleSubmit={handleSubmitForm} />
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
