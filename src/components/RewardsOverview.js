import { useEffect, useState } from "react";
import { downloadDataUrl, getRewardsReportCsv } from "../util";
import Spinner from "./Spinner";
import CidForm from "./CidForm";
import InternalLayout from "./InternalLayout";
import { apiGet } from "../api";
import RewardsTable from "./RewardsTable";

const RewardsOverview = () => {
    const [data, setData] = useState("");
    const [cid, setCid] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (cid) {
                const res = await apiGet(`accounting/rewards-data?&cid=${cid}`);
                if (res.status === 403) {
                    return;
                }

                if (res.ok) {
                    const reportData = await res.json();
                    setShowSpinner(false);
                    setData(reportData);
                }
            }
        };
        fetchData().catch(console.error);
    }, [cid]);

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
        setCid(e.target.form.cid.value);
    };

    return (
        <InternalLayout>
            <CidForm handleSubmit={handleSubmitForm} />
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
