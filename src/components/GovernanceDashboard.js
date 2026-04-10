import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../api";
import PublicLayout from "./PublicLayout";
import ProposalStatsChart from "./ProposalStatsChart";
import VoteTimingChart from "./VoteTimingChart";
import VotingPowerChart from "./VotingPowerChart";
import ProposalTimelineChart from "./ProposalTimelineChart";
import { Bubble } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const CC_SYMBOLS = {
    "u0qj944rhWE": "LEU",
    "kygch5kVGq7": "NYT",
    "s1vrqQL2SD": "PNQ",
    "dpcmj33LUs9": "GBD",
};

const VoterBubbleChart = ({ voters, unit }) => {
    const toPoint = (v) => ({
        x: v.proposalsVoted,
        y: Math.max(v.avgSpending3mo, 0.1),
        r: v.avgVotingPower * 4,
        voter: v.voter.slice(0, 8) + "\u2026",
        power: v.avgVotingPower,
        name: v.name,
    });
    const personal = voters.filter((v) => !v.isBusiness).map(toPoint);
    const business = voters.filter((v) => v.isBusiness).map(toPoint);

    return (
        <Bubble
            data={{
                datasets: [
                    {
                        label: "Personal",
                        data: personal,
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                    {
                        label: "Business",
                        data: business,
                        backgroundColor: "rgba(255, 159, 64, 0.5)",
                        borderColor: "rgba(255, 159, 64, 1)",
                        borderWidth: 1,
                    },
                ],
            }}
            options={{
                plugins: {
                    legend: {
                        labels: { font: { size: 12, family: "Poppins" } },
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const d = ctx.raw;
                                const lines = [d.name ? `${d.name} (${d.voter})` : d.voter];
                                lines.push(`Proposals: ${d.x}`);
                                lines.push(`Avg 3mo spending: ${d.y.toFixed(0)} ${unit}`);
                                lines.push(`Avg power: ${d.power}`);
                                return lines;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            text: "Proposals Voted",
                            display: true,
                            font: { size: 13, family: "Poppins" },
                        },
                        ticks: { font: { size: 12, family: "Poppins" } },
                    },
                    y: {
                        type: "logarithmic",
                        title: {
                            text: `Avg 3-Month Spending (${unit})`,
                            display: true,
                            font: { size: 13, family: "Poppins" },
                        },
                        ticks: { font: { size: 12, family: "Poppins" } },
                    },
                },
            }}
        />
    );
};

const VoterKPIs = ({ voters, unit }) => {
    if (!voters.length) return null;
    const sorted = (arr) => [...arr].sort((a, b) => a - b);
    const median = (arr) => {
        const s = sorted(arr);
        const mid = Math.floor(s.length / 2);
        return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
    };
    const medianProposals = median(voters.map((v) => v.proposalsVoted));
    const medianSpending = median(voters.map((v) => v.avgSpending3mo));
    return (
        <p className="is-size-7 mt-2 mb-3">
            Median voter: <strong>{medianProposals}</strong> proposals voted,{" "}
            <strong>{medianSpending.toFixed(0)}</strong> {unit} turnover (3mo avg before proposal).{" "}
            {voters.length} voters total.
        </p>
    );
};

const VoterHighscoreTable = ({ voters }) => {
    return (
        <div className="table-container">
            <table className="table is-striped is-fullwidth is-size-7">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Account</th>
                        <th>Proposals Voted</th>
                        <th>Avg Power</th>
                        <th>Avg 3mo Spending</th>
                    </tr>
                </thead>
                <tbody>
                    {voters.map((v, i) => (
                        <tr key={v.voter}>
                            <td>{i + 1}</td>
                            <td title={v.voter} style={{ fontFamily: "monospace" }}>
                                {v.name
                                    ? <>{v.name} <span style={{ color: "#999" }}>({v.voter.slice(0, 8)}&hellip;)</span></>
                                    : <>{v.voter.slice(0, 8)}&hellip;</>}
                            </td>
                            <td>{v.proposalsVoted}</td>
                            <td>{v.avgVotingPower}</td>
                            <td>{v.avgSpending3mo > 0 ? v.avgSpending3mo.toFixed(0) : ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

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
    const [voterHighscore, setVoterHighscore] = useState(null);
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

    useEffect(() => {
        const fetchHighscore = async () => {
            const cidParam = communityFilter !== "all" && communityFilter !== "global"
                ? `?cid=${communityFilter}` : "";
            try {
                const res = await apiGet(`governance/voter-highscore${cidParam}`);
                if (res.ok) setVoterHighscore(await res.json());
            } catch (e) {
                console.error("Failed to fetch voter highscore", e);
            }
        };
        fetchHighscore();
    }, [communityFilter]);

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

            {voterHighscore && voterHighscore.length > 0 && (
                <>
                    <h3 className="title is-5 mt-5">Voter Participation</h3>
                    <VoterBubbleChart
                        voters={voterHighscore}
                        unit={communityFilter !== "all" && communityFilter !== "global"
                            ? (CC_SYMBOLS[communityFilter] || "CC")
                            : "nominal"}
                    />
                    <VoterKPIs
                        voters={voterHighscore}
                        unit={communityFilter !== "all" && communityFilter !== "global"
                            ? (CC_SYMBOLS[communityFilter] || "CC")
                            : "nominal"}
                    />
                    <VoterHighscoreTable voters={voterHighscore} />
                </>
            )}
        </PublicLayout>
    );
};

export default GovernanceDashboard;
