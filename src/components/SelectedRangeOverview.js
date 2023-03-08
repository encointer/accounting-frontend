import { useContext, useEffect, useState } from "react";
import Layout from "./Layout";
import Spinner from "./Spinner";
import { apiGet } from "../api";
import { MeContext } from "../App";
import StartEndForm from "./StartEndForm";
import DailyDigestTable from "./DailyDigestTable";
import { round } from "../util";
import AccountReportTable from "./AccountReportTable";

const SelectedRangeOverview = () => {
    const { me } = useContext(MeContext);
    const [data, setData] = useState({});
    const [cid, setCid] = useState("");
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (cid && start && end) {
                const res = await apiGet(
                    `accounting/selected-range-data?&account=${
                        me.address
                    }&cid=${cid}&start=${start.getTime()}&end=${end.getTime()}`
                );

                if (res.status === 403) {
                    return;
                }

                if (res.ok) {
                    const reportData = await res.json();
                    reportData.data.balance = reportData.data.endBalance;
                    reportData.data.month = "All";
                    setData(reportData);
                    setShowSpinner(false);
                }
            }
        };
        fetchData().catch(console.error);
    }, [cid, me.address, start, end]);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setShowSpinner(true);
        const start = new Date(e.target.form.start.value);
        const end = new Date(e.target.form.end.value);
        end.setHours(end.getHours() + 23);
        end.setMinutes(end.getMinutes() + 59);
        end.setSeconds(end.getSeconds() + 59);
        setCid(e.target.form.cid.value);
        setStart(start);
        setEnd(end);
    };

    return (
        <Layout communityName={data.communityName}>
            <StartEndForm handleSubmit={handleSubmitForm} />
            <br />
            <br />
            {showSpinner && <Spinner />}
            {Object.keys(data).length !== 0 && (
                <div>
                    <p style={{ fontSize: "3.5vh" }}>{`${data.name} at ${
                        data.communityName
                    } from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`}</p>
                    <br />
                    <p style={{ fontSize: "2vh" }}>Summary</p>
                    <br />
                    <p>Start Balance: {round(data.data.startBalance)}</p>
                    <p>End Balance: {round(data.data.endBalance)}</p>
                    <br />
                    <AccountReportTable data={{ data: [data.data] }} />
                    <br />
                    <br />
                    <p style={{ fontSize: "2vh" }}>Daily Digest</p>
                    <br />
                    <DailyDigestTable dailyDigest={data.data.dailyDigest} />
                </div>
            )}
        </Layout>
    );
};

export default SelectedRangeOverview;
