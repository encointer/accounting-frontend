import { useState, useRef } from "react";
import Spinner from "./Spinner";
import InternalLayout from "./InternalLayout";
import { apiGet } from "../api";
import CidSelect from "./CidSelect";
import MonthRangeSlider from "./MonthRangeSlider";
import FlowGraph from "./FlowGraph";
import CircularityChart from "./CircularityChart";

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const FlowGraphReport = () => {
    const [data, setData] = useState(null);
    const [communityName, setCommunityName] = useState("");
    const [circularityData, setCircularityData] = useState(null);
    const [showSpinner, setShowSpinner] = useState(false);
    const [showCircularitySpinner, setShowCircularitySpinner] = useState(false);
    const [rangeLabel, setRangeLabel] = useState("");

    const now = new Date();
    const maxIndex = MonthRangeSlider.yearMonthToIndex(
        now.getUTCFullYear(), now.getUTCMonth()
    );
    const [range, setRange] = useState([Math.max(0, maxIndex - 5), maxIndex]);
    const cidRef = useRef(null);

    const fetchFlow = async () => {
        const cid = cidRef.current?.value;
        if (!cid) return;

        setData(null);
        setShowSpinner(true);

        const start = MonthRangeSlider.indexToYearMonth(range[0]);
        const end = MonthRangeSlider.indexToYearMonth(range[1]);

        const params = range[0] === range[1]
            ? `year=${start.year}&month=${start.month}`
            : `startYear=${start.year}&startMonth=${start.month}&endYear=${end.year}&endMonth=${end.month}`;

        const res = await apiGet(`accounting/community-flow?cid=${cid}&${params}`);
        if (res.status === 403) { setShowSpinner(false); return; }
        if (res.ok) {
            const json = await res.json();
            setShowSpinner(false);
            setCommunityName(json.communityName);
            setData({ nodes: json.nodes, edges: json.edges });

            // Build range label
            if (range[0] === range[1]) {
                setRangeLabel(`${monthNames[start.month]} ${start.year}`);
            } else {
                setRangeLabel(
                    `${monthNames[start.month]} ${start.year} \u2014 ${monthNames[end.month]} ${end.year}`
                );
            }
        }
    };

    const fetchCircularity = async (cid) => {
        setCircularityData(null);
        setShowCircularitySpinner(true);
        const res = await apiGet(`accounting/circularity?cid=${cid}`);
        if (res.ok) {
            const json = await res.json();
            setCircularityData(json.data);
        }
        setShowCircularitySpinner(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchFlow().catch(console.error);
        const cid = cidRef.current?.value;
        if (cid) fetchCircularity(cid).catch(console.error);
    };

    return (
        <InternalLayout>
            <form>
                <div style={{ width: "min(100%, 600px)" }}>
                    <CidSelect ref={cidRef} />
                    <div style={{ margin: "16px 0" }}>
                        <label>Month Range</label>
                        <MonthRangeSlider value={range} onChange={setRange} />
                    </div>
                    <div className="field is-grouped">
                        <div className="control">
                            <button
                                className="button is-link"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <br />
            {showSpinner && <Spinner />}
            {data && data.nodes.length > 0 && (
                <div>
                    <p style={{ fontSize: "3.5vh" }}>
                        {`Community Flow at ${communityName} \u2014 ${rangeLabel}`}
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
                <p>No transfers found for this period.</p>
            )}
            <br />
            {showCircularitySpinner && <Spinner />}
            {circularityData && (
                <div>
                    <p style={{ fontSize: "3.5vh" }}>
                        Circularity Index — {communityName}
                    </p>
                    <CircularityChart data={circularityData} />
                </div>
            )}
        </InternalLayout>
    );
};

export default FlowGraphReport;
