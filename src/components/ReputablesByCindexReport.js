import { useEffect, useState } from "react";
import {
    downloadDataUrl,
    getReputablesByCindexReportCsv,
} from "../util";
import Spinner from "./Spinner";
import InternalLayout from "./InternalLayout";
import { apiGet } from "../api";
import CidForm from "./CidForm";
import ReputablesByCindexChart from "./ReputablesByCindexChart";

const ReputablesByCindexReport = () => {
    const [data, setData] = useState({});
    const [communityName, setCommunityName] = useState("");
    const [cid, setCid] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (cid) {
                const res = await apiGet(
                    `accounting/reputables-by-cindex?&cid=${cid}`
                );
                if (res.status === 403) {
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    setShowSpinner(false);
                    setCommunityName(data.communityName);
                    setData(data.data);
                }
            }
        };
        fetchData().catch(console.error);
    }, [cid]);

    const handleDownloadReport = async () => {
        const csv = getReputablesByCindexReportCsv(data);
        const filename = `ReputablesByCindex_${communityName}`;
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
    };

    return (
        <InternalLayout>
            <CidForm handleSubmit={handleSubmitForm} />
            <br />
            <br />
            {showSpinner && <Spinner />}
            {Object.keys(data).length !== 0 && (
                <div>
                    <p
                        style={{ fontSize: "3.5vh" }}
                    >{`Reputables by Cindex at ${communityName}`}</p>
                    <ReputablesByCindexChart
                        communityName={communityName}
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

export default ReputablesByCindexReport;
