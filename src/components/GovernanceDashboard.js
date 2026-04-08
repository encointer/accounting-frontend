import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../api";
import PublicLayout from "./PublicLayout";
import ProposalStatsChart from "./ProposalStatsChart";
import VoteTimingChart from "./VoteTimingChart";
import VotingPowerChart from "./VotingPowerChart";
import ProposalTimelineChart from "./ProposalTimelineChart";

const stateColor = {
    Enacted: "success",
    Approved: "info",
    Confirming: "warning",
    Ongoing: "primary",
    Rejected: "danger",
    SupersededBy: "light",
};

function avg(arr) {
    return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
}

const ProposalKPIs = ({ proposals }) => {
    const all = proposals.filter((p) => p.turnout > 0);
    const approved = all.filter((p) => p.state === "Enacted");
    const rejected = all.filter((p) => p.state === "Rejected");
    const total = approved.length + rejected.length;

    if (all.length === 0) return null;

    const rows = [
        { label: "Approved", items: approved },
        { label: "Rejected", items: rejected },
        { label: "All proposals", items: all },
    ];

    return (
        <table className="table is-narrow is-size-7 mt-3" style={{ maxWidth: 500 }}>
            <thead>
                <tr>
                    <th></th>
                    <th>% of Proposals</th>
                    <th>Avg Turnout</th>
                    <th>Avg Approval</th>
                </tr>
            </thead>
            <tbody>
                {rows.map(({ label, items }) => {
                    if (items.length === 0) return null;
                    const pct = label === "All proposals"
                        ? 100
                        : total > 0 ? (items.length / total) * 100 : 0;
                    return (
                        <tr key={label} style={label === "All proposals" ? { fontWeight: "bold" } : {}}>
                            <td>{label}</td>
                            <td>{pct.toFixed(1)}%</td>
                            <td>{avg(items.map((p) => p.turnoutPct)).toFixed(1)}%</td>
                            <td>{avg(items.map((p) => p.approvalPct)).toFixed(1)}%</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

const GovernanceDashboard = () => {
    const [proposals, setProposals] = useState([]);
    const [voteTiming, setVoteTiming] = useState(null);
    const [votingPower, setVotingPower] = useState(null);
    const [loading, setLoading] = useState(true);
    const [communityFilter, setCommunityFilter] = useState("all");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propRes, voteRes, vpRes, svcRes] = await Promise.all([
                    apiGet("governance/proposals"),
                    apiGet("governance/vote-timing"),
                    apiGet("governance/voting-power-analysis"),
                    apiGet("governance/swap-voter-client-analysis"),
                ]);
                let clientMap = {};
                if (svcRes.ok) {
                    const svcData = await svcRes.json();
                    for (const s of svcData) {
                        if (s.totalAyeVoters > 0) {
                            clientMap[s.id] = Math.round((s.clientVoters / s.totalAyeVoters) * 1000) / 10;
                        }
                    }
                }
                if (propRes.ok) {
                    const props = await propRes.json();
                    setProposals(props.map((p) => ({ ...p, clientPct: clientMap[p.id] })));
                }
                if (voteRes.ok) setVoteTiming(await voteRes.json());
                if (vpRes.ok) setVotingPower(await vpRes.json());
            } catch (e) {
                console.error("Failed to fetch governance data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Distinct communities for the filter dropdown, with names
    const communities = useMemo(() => {
        const map = {};
        proposals.forEach((p) => {
            if (p.communityId && !map[p.communityId]) {
                map[p.communityId] = p.communityName || p.communityId;
            }
        });
        return Object.entries(map).sort((a, b) => a[1].localeCompare(b[1]));
    }, [proposals]);

    const filtered = useMemo(() => {
        if (communityFilter === "all") return proposals;
        if (communityFilter === "global")
            return proposals.filter((p) => !p.communityId);
        return proposals.filter((p) => p.communityId === communityFilter);
    }, [proposals, communityFilter]);

    const filteredVP = useMemo(() => {
        if (!votingPower?.proposals) return [];
        if (communityFilter === "all") return votingPower.proposals;
        if (communityFilter === "global")
            return votingPower.proposals.filter((p) => !p.communityId);
        return votingPower.proposals.filter((p) => p.communityId === communityFilter);
    }, [votingPower, communityFilter]);

    if (loading) {
        return (
            <PublicLayout>
                <div className="loader-wrapper">
                    <div className="loader is-loading"></div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <h2 className="title is-4">Governance Dashboard</h2>

            <div className="field">
                <label className="label is-small">Community</label>
                <div className="control">
                    <div className="select is-small">
                        <select
                            value={communityFilter}
                            onChange={(e) => setCommunityFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="global">Global only</option>
                            {communities.map(([cid, name]) => (
                                <option key={cid} value={cid}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <table className="table is-striped is-fullwidth is-size-7">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Action</th>
                            <th>State</th>
                            <th>Date</th>
                            <th>Electorate</th>
                            <th>Turnout</th>
                            <th>Ayes</th>
                            <th>Turnout%</th>
                            <th>Approval%</th>
                            <th>Clients%</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td
                                    title={p.actionSummary}
                                    style={{
                                        maxWidth: "300px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {p.actionSummary}
                                </td>
                                <td>
                                    <span
                                        className={`tag is-${stateColor[p.state] || "light"}`}
                                    >
                                        {p.state}
                                    </span>
                                </td>
                                <td>
                                    {p.start
                                        ? new Date(p.start).toLocaleDateString()
                                        : ""}
                                </td>
                                <td>{p.electorateSize}</td>
                                <td>{p.turnout}</td>
                                <td>{p.ayes}</td>
                                <td>{p.turnoutPct}%</td>
                                <td>{p.approvalPct}%</td>
                                <td>{p.clientPct != null ? `${p.clientPct}%` : ""}</td>
                                <td>
                                    {p.passing ? (
                                        <span className="tag is-success is-light">
                                            Pass
                                        </span>
                                    ) : (
                                        <span className="tag is-danger is-light">
                                            Fail
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filtered.length > 0 && (
                <>
                    <h3 className="title is-5 mt-5">
                        Proposal Statistics
                    </h3>
                    <ProposalStatsChart proposals={filtered} />
                    <ProposalKPIs proposals={filtered} />
                </>
            )}

            {filteredVP.length > 0 && (
                <>
                    <h3 className="title is-5 mt-5">Voting Power Analysis</h3>
                    <VotingPowerChart
                        proposals={filteredVP}
                        reputationLifetime={votingPower?.reputationLifetime}
                    />
                </>
            )}

            {voteTiming && filtered.length > 0 && (
                <>
                    <h3 className="title is-5 mt-5">Vote Timing</h3>
                    <VoteTimingChart
                        votes={voteTiming.votes}
                        proposals={filtered}
                    />
                </>
            )}

            {filtered.length > 0 && (
                <>
                    <h3 className="title is-5 mt-5">Proposal Timeline</h3>
                    <ProposalTimelineChart proposals={filtered} />
                </>
            )}
        </PublicLayout>
    );
};

export default GovernanceDashboard;
