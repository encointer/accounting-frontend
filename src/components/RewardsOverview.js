import { useEffect, useState } from "react";
import {
    downloadDataUrl,
    getRewardsReportCsv,
} from "../util";
import Spinner from "./Spinner";
import CidForm from "./CidForm";
import InternalLayout from "./InternalLayout";
import { apiGet } from "../api";
import RewardsTable from "./RewardsTable";

const RewardsOverview = () => {
    const [token, setToken] = useState("");
    const [data, setData] = useState("");
    const [cid, setCid] = useState("");
    const [wrongPassword, setWrongPassword] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (cid && token) {
                const res = await apiGet(`rewards-data?&cid=${cid}`, token);
                if (res.status === 403) {
                    setWrongPassword(true);
                    return;
                }

                if (res.ok) {
                    const reportData = await res.json();
                    setWrongPassword(false);
                    setShowSpinner(false);
                    setData(reportData);
                }
            }
        };
        fetchData().catch(console.error);
    }, [cid, token]);

    const handleDownloadReport = async () => {
        const csv = getRewardsReportCsv(data.data);
        const filename = `RewardsReport_${data.communityName}`;
        const dataUrl = window.URL.createObjectURL(
            new Blob([csv], { type: "text/csv" })
        );

        downloadDataUrl(dataUrl, filename);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setShowSpinner(true);
        setToken(e.target.form.token.value);
        setCid(e.target.form.cid.value);
    };

    return (
        <InternalLayout>
            <CidForm handleSubmit={handleSubmitForm} />
            {wrongPassword && <p style={{ color: "red" }}>Wrong password</p>}
            <br />
            <br />
            {showSpinner && <Spinner />}
            {Object.keys(data).length !== 0 && (
                <RewardsTable
                    data={data}
                    handleDownloadReport={handleDownloadReport}
                />
            )}
        </InternalLayout>
    );
};

export default RewardsOverview;
