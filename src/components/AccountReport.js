import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import Layout from "./Layout";
import { downloadDataUrl, getMonthName, getTxnLogCsv } from "../util";
import { getReport } from "../report";
import JSZip from "jszip";
import Summary from "./Summary";
import Spinner from "./Spinner";
import { API_URL } from "../consts";
import InternalLayout from "./InternalLayout";
import CidSelect from "./CidSelect";

const AccountReport = () => {
    const [data, setData] = useState({});
    const [address, setAddress] = useState("");
    const [token, setToken] = useState("");
    const [cid, setCid] = useState("");
    const [wrongPassword, setWrongPassword] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (address && cid && token) {
                const res = await fetch(
                    `${API_URL}/get-accounting-data?&account=${address}&cid=${cid}&token=${token}`
                );
                if (res.status === 403) {
                    setWrongPassword(true);
                    return;
                }

                if (res.ok) {
                    const reportData = await res.json();
                    setWrongPassword(false);
                    reportData.data.forEach(
                        (e) => (e.month = getMonthName(e.month))
                    );
                    // reportData.data = [
                    //     reportData.data[0],
                    //     reportData.data[0],
                    //     reportData.data[0],
                    //     reportData.data[0],
                    //     reportData.data[0],
                    // ];
                    setData(reportData);
                    setShowSpinner(false);
                }
            }
        };
        fetchData().catch(console.error);
    }, [address, cid, token]);

    const handleSummaryLogDownlaod = async () => {
        const report = await getReport(data);
        const zip = new JSZip();
        zip.file("report.pdf", report.output("blob"));
        data.data.forEach((e, idx) =>
            zip.file(`${idx}_${e.month}.csv`, getTxnLogCsv(e.txnLog))
        );

        let downloadFile = await zip.generateAsync({ type: "base64" });
        downloadDataUrl(
            "data:application/zip;base64," + downloadFile,
            "report.zip"
        );
    };

    const handleSubmitAddressForm = (e) => {
        e.preventDefault();
        setData({});
        setShowSpinner(true);
        setAddress(e.target.form.address.value);
        setToken(e.target.form.token.value);
        setCid(e.target.form.cid.value);
    };

    return (
        <Layout title="Account Report" communityName={data.communityName}>
            <div className="container" style={{ width: "100%" }}>
                <AddressForm handleSubmit={handleSubmitAddressForm} />
                {wrongPassword && (
                    <p style={{ color: "red" }}>Wrong password</p>
                )}
                <br />
                <br />
                {showSpinner && <Spinner />}
                {Object.keys(data).length !== 0 && (
                    <Summary
                        data={data}
                        handleSummaryLogDownlaod={handleSummaryLogDownlaod}
                    />
                )}
            </div>
        </Layout>
    );
};

export default AccountReport;
