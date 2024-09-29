import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import InternalLayout from "./InternalLayout";
import { apiGet } from "../api";
import SankeyChart from "./SankeyChart";
import AccountStartEndForm from "./AccountStartEndForm";
import CidSelect from "./CidSelect";

const SankeyReport = () => {
    const [data, setData] = useState({});
    const [communityName, setCommunityName] = useState("");
    const [account, setAccount] = useState("");
    const [accountName, setAccountName] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [cid, setCid] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (start && end && account) {
                const res = await apiGet(
                    `accounting/sankey-report?cid=${cid}&start=${start}&end=${end}&account=${account}`
                );
                if (res.status === 403) {
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    setShowSpinner(false);
                    setCommunityName(data.communityName);
                    setData(data.data);
                    setAccountName(data.accountName);
                }
            }
        };
        fetchData().catch(console.error);
    }, [start, end, account]);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setData({});
        setShowSpinner(true);
        const start = new Date(e.target.form.startDate.value).getTime()
        const end = new Date(e.target.form.endDate.value).getTime();
        if(start >= end){
            alert('Please set start date before end date')
            setShowSpinner(false);
            return
        }
        setAccount(e.target.form.account.value);
        setCid(e.target.form.cid.value);
        setStart(start);
        setEnd(end);
    };

    return (
        <InternalLayout>
            <CidSelect />
            <AccountStartEndForm handleSubmit={handleSubmitForm} />
            <br />
            <br />
            {showSpinner && <Spinner />}
            {Object.keys(data).length !== 0 && (
                <div>
                    <p
                        style={{ fontSize: "3.5vh" }}
                    >{`Sankey Chart for ${accountName} at ${communityName}`}</p>
                    <SankeyChart data={data} accountName={accountName} />
                </div>
            )}
        </InternalLayout>
    );
};

export default SankeyReport;
