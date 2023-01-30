import { useEffect, useState } from "react";
import Layout from "./Layout";
import { downloadDataUrl, getAccountOverviewCsv } from "../util";
import TimestampCidForm from "./TimestampCidForm";
import AccountOverviewTable from "./AccountOverviewTable";

const AccountOverview = () => {
    const [data, setData] = useState({});
    const [cid, setCid] = useState("");
    const [timestamp, setTimestamp] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (cid && timestamp) {
                const res = await fetch(
                    `http://localhost:8081/get-account-overview?timestamp=${
                        timestamp * 1000
                    }&cid=${cid}`
                );

                if (res.ok) {
                    const d = await res.json();
                    d.data.sort((a, b) => b.balance - a.balance);
                    setData(d);
                }
            }
        };
        fetchData().catch(console.error);
    });

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
        setTimestamp(new Date(e.target.form[0].value).getTime());
        setCid(e.target.form.cid.value);
    };

    return (
        <Layout>
            <div className="container" style={{ width: "100%" }}>
                <TimestampCidForm handleSubmit={handleSubmitForm} />
                <br />
                <br />
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
