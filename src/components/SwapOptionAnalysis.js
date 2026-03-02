import { useEffect, useState } from "react";
import { apiGet } from "../api";
import PublicLayout from "./PublicLayout";
import Spinner from "./Spinner";
import SwapOptionPieChart from "./SwapOptionPieChart";
import SwapOptionTimeline from "./SwapOptionTimeline";

const TREASURIES = [
    { cid: "u0qj944rhWE", name: "Leu" },
    { cid: "kygch5kVGq7", name: "Nyota" },
    { cid: "s1vrqQL2SD", name: "PayNuQ" },
];

const SwapOptionAnalysis = () => {
    const [cid, setCid] = useState(TREASURIES[0].cid);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState("native");

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiGet(`accounting/swap-option-analysis?cid=${cid}`);
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    setError(err.error || `HTTP ${res.status}`);
                    setData(null);
                } else {
                    const result = await res.json();
                    if (!cancelled) setData(result);
                }
            } catch (e) {
                if (!cancelled) setError(e.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchData();
        return () => { cancelled = true; };
    }, [cid]);

    const assetData = tab === "native" ? data?.native : data?.asset;
    const assetLabel = tab === "native" ? "KSM" : (data?.asset?.assetName || "USDC");

    return (
        <PublicLayout>
            <h2 className="title is-4">Swap Option Analysis</h2>

            <div className="field is-grouped">
                <div className="control">
                    <div className="select is-small">
                        <select value={cid} onChange={(e) => setCid(e.target.value)}>
                            {TREASURIES.map((t) => (
                                <option key={t.cid} value={t.cid}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading && <Spinner />}
            {error && <div className="notification is-danger is-light">{error}</div>}

            {data && !loading && (
                <>
                    <div className="tabs is-boxed is-small">
                        <ul>
                            <li className={tab === "native" ? "is-active" : ""}>
                                <a href="#ksm" onClick={(e) => { e.preventDefault(); setTab("native"); }}>KSM</a>
                            </li>
                            <li className={tab === "asset" ? "is-active" : ""}>
                                <a href="#usdc" onClick={(e) => { e.preventDefault(); setTab("asset"); }}>{data.asset?.assetName || "USDC"}</a>
                            </li>
                        </ul>
                    </div>

                    <div className="columns">
                        <div className="column is-5">
                            <h3 className="title is-5">Treasury Allocation ({assetLabel})</h3>
                            <div style={{ maxWidth: 400, margin: "0 auto" }}>
                                <SwapOptionPieChart
                                    currentBalance={assetData?.currentBalance || 0}
                                    activeOptions={assetData?.activeOptions || []}
                                    proposals={assetData?.proposals || []}
                                    assetLabel={assetLabel}
                                />
                            </div>
                        </div>
                        <div className="column is-7">
                            <h3 className="title is-5">Balance Timeline ({assetLabel})</h3>
                            <SwapOptionTimeline
                                currentBalance={assetData?.currentBalance || 0}
                                activeOptions={assetData?.activeOptions || []}
                                proposals={assetData?.proposals || []}
                                events={assetData?.events || []}
                                nextEnactmentTimestamp={data.nextEnactmentTimestamp}
                                assetLabel={assetLabel}
                            />
                        </div>
                    </div>

                    {(assetData?.activeOptions?.length > 0 || assetData?.proposals?.length > 0) && (
                        <div className="mt-4">
                            <h3 className="title is-5">Details</h3>
                            {assetData.activeOptions.length > 0 && (
                                <>
                                    <h4 className="subtitle is-6">Active Swap Options</h4>
                                    <div className="table-container">
                                        <table className="table is-striped is-fullwidth is-size-7">
                                            <thead>
                                                <tr>
                                                    <th>Beneficiary</th>
                                                    <th>Remaining</th>
                                                    <th>Rate</th>
                                                    <th>Burn</th>
                                                    <th>Valid Until</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {assetData.activeOptions.map((opt, i) => (
                                                    <tr key={i}>
                                                        <td title={opt.beneficiary}>
                                                            {opt.beneficiary ? opt.beneficiary.slice(0, 8) + "..." : "?"}
                                                        </td>
                                                        <td>{opt.remainingAllowance != null ? opt.remainingAllowance.toFixed(4) : "?"} {assetLabel}</td>
                                                        <td>{opt.rate != null ? opt.rate : "?"}</td>
                                                        <td>{opt.doBurn != null ? (opt.doBurn ? "Yes" : "No") : "?"}</td>
                                                        <td>{opt.validUntil ? new Date(opt.validUntil).toLocaleDateString() : "None"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                            {assetData.proposals.length > 0 && (
                                <>
                                    <h4 className="subtitle is-6">Proposals</h4>
                                    <div className="table-container">
                                        <table className="table is-striped is-fullwidth is-size-7">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>State</th>
                                                    <th>Beneficiary</th>
                                                    <th>Allowance</th>
                                                    <th>Rate</th>
                                                    <th>Passing</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {assetData.proposals.map((p) => (
                                                    <tr key={p.id}>
                                                        <td>{p.id}</td>
                                                        <td><span className={`tag is-${
                                                            p.state === "Enacted" ? "success" :
                                                            p.state === "Approved" ? "info" :
                                                            p.state === "Ongoing" ? "primary" :
                                                            p.state === "Confirming" ? "warning" : "light"
                                                        }`}>{p.state}</span></td>
                                                        <td title={p.beneficiary}>
                                                            {p.beneficiary ? p.beneficiary.slice(0, 8) + "..." : "-"}
                                                        </td>
                                                        <td>{p.allowance != null ? p.allowance.toFixed(4) : "-"} {assetLabel}</td>
                                                        <td>{p.rate != null ? p.rate : "-"}</td>
                                                        <td>{p.passing ? <span className="tag is-success is-light">Pass</span> : <span className="tag is-danger is-light">Fail</span>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </PublicLayout>
    );
};

export default SwapOptionAnalysis;
