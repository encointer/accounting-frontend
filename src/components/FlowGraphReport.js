import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import InternalLayout from "./InternalLayout";
import { apiGet } from "../api";
import CidMonthForm from "./CidMonthForm";
import FlowGraph from "./FlowGraph";

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const FlowGraphReport = () => {
    const [data, setData] = useState(null);
    const [communityName, setCommunityName] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [cid, setCid] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (cid && year && month !== "") {
                const res = await apiGet(
                    `accounting/community-flow?cid=${cid}&year=${year}&month=${month}`
                );
                if (res.status === 403) return;
                if (res.ok) {
                    const json = await res.json();
                    setShowSpinner(false);
                    setCommunityName(json.communityName);
                    setData({ nodes: json.nodes, edges: json.edges });
                }
            }
        };
        fetchData().catch(console.error);
    }, [cid, year, month]);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setData(null);
        setShowSpinner(true);
        setCid(e.target.form.cid.value);
        setYear(e.target.form.year.value);
        setMonth(e.target.form.month.value);
    };

    return (
        <InternalLayout>
            <CidMonthForm handleSubmit={handleSubmitForm} />
            <br />
            <br />
            {showSpinner && <Spinner />}
            {data && data.nodes.length > 0 && (
                <div>
                    <p style={{ fontSize: "3.5vh" }}>
                        {`Community Flow at ${communityName} — ${monthNames[parseInt(month)]} ${year}`}
                    </p>
                    <p style={{ fontSize: "1.5vh", marginBottom: "1em" }}>
                        <span style={{ color: "#3273dc" }}>Blue</span>: acceptance points
                        {" | "}
                        <span style={{ color: "#ff9f43" }}>Orange</span>: vouchers
                        {" | "}
                        <span style={{ color: "#b86bff" }}>Purple</span>: gov
                        {" | "}
                        <span style={{ color: "#23d160" }}>Green</span>: personal
                        {" | "}
                        <span style={{ color: "#FFD700" }}>Gold</span>: circular flows
                    </p>
                    <FlowGraph nodes={data.nodes} edges={data.edges} />
                </div>
            )}
            {data && data.nodes.length === 0 && (
                <p>No transfers found for this month.</p>
            )}
        </InternalLayout>
    );
};

export default FlowGraphReport;
