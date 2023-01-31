import { useEffect, useState } from "react";
import Layout from "./Layout";
import { downloadDataUrl, getAccountOverviewCsv } from "../util";
import TimestampCidForm from "./TimestampCidForm";
import AccountOverviewTable from "./AccountOverviewTable";
import Spinner from "./Spinner";
import { API_URL } from "../consts";

const AccountOverview = () => {
    const [data, setData] = useState({});
    const [cid, setCid] = useState("");
    const [timestamp, setTimestamp] = useState(0);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (cid && timestamp) {
                const res = await fetch(
                    `${API_URL}/get-account-overview?timestamp=${
                        timestamp
                    }&cid=${cid}`
                );

                if (res.ok) {
                    const d = await res.json();
                    d.data.sort((a, b) => b.balance - a.balance);
                    setData(d);
                    setShowSpinner(false);
                }
            }
        };
        fetchData().catch(console.error);
    }, [cid, timestamp]);

    const handleDownloadReport = async () => {
        const csv = getAccountOverviewCsv(data.data);
        const filename = `Account_Overview_${new Date(
            timestamp
        ).toUTCString()}_${data.communityName}`;
        const dataUrl = window.URL.createObjectURL(
            new Blob([csv], { type: "text/csv" })
        );

        downloadDataUrl(dataUrl, filename);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setData({});
        setShowSpinner(true);
        setTimestamp(new Date(e.target.form[0].value).getTime());
        setCid(e.target.form.cid.value);
    };

    return (
        <Layout>
            <div className="container" style={{ width: "100%" }}>
                <TimestampCidForm handleSubmit={handleSubmitForm} />
                <br />
                <br />
                {showSpinner && <Spinner />}
                {Object.keys(data).length !== 0 && (
                    <div
                        style={{
                            display: "flex",
                            "align-items": "center",
                            "justify-content": "center",
                        }}
                    >
                        <AccountOverviewTable
                            data={data.data}
                            handleDownloadReport={handleDownloadReport}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AccountOverview;
