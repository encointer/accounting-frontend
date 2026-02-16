import { useContext, useEffect, useState } from "react";
import PublicInternalLayout from "./PublicInternalLayout";
import { downloadDataUrl, getMonthName, getTxnLogCsv } from "../util";
import { getReport } from "../report";
import JSZip from "jszip";
import Summary from "./Summary";
import Spinner from "./Spinner";
import { apiGet } from "../api";
import CidForm from "./CidForm";
import { MeContext } from "../App";

const AccountReport = () => {
    const { me } = useContext(MeContext);
    const [data, setData] = useState({});
    const [cid, setCid] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (cid) {
                const res = await apiGet(
                    `accounting/accounting-data?&account=${me.address}&cid=${cid}`
                );

                if (res.status === 403) {
                    setShowSpinner(false);
                    alert("Access denied. Please log in again.");
                    return;
                }

                if (res.ok) {
                    const reportData = await res.json();
                    reportData.data.forEach(
                        (e) => (e.month = getMonthName(e.month))
                    );
                    // reportData.data = [
                    //     reportData.data[0],
                    //     reportData.data[0],
                    //     reportData.data[0],
                    //     reportData.data[0],
                    //     reportData.data[0],
                    //     reportData.data[0],
                    //     reportData.data[0],
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
    }, [cid, me.address]);

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
        setCid(e.target.form.cid.value);
    };

    return (
        <PublicInternalLayout communityName={data.communityName}>
            <CidForm handleSubmit={handleSubmitAddressForm} />
            <br />
            <br />
            {showSpinner && <Spinner />}
            {Object.keys(data).length !== 0 && (
                <div>
                    <Summary
                        data={data}
                        handleSummaryLogDownlaod={handleSummaryLogDownlaod}
                    />
                </div>
            )}
        </PublicInternalLayout>
    );
};

export default AccountReport;
