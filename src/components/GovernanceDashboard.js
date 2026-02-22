import { useEffect, useState } from "react";
import { apiGet } from "../api";
import PublicLayout from "./PublicLayout";
import ProposalStatsChart from "./ProposalStatsChart";
import VoteTimingChart from "./VoteTimingChart";

const stateColor = {
    Enacted: "success",
    Approved: "info",
    Confirming: "warning",
    Ongoing: "primary",
    Rejected: "danger",
    SupersededBy: "light",
};

const GovernanceDashboard = () => {
    const [proposals, setProposals] = useState([]);
    const [voteTiming, setVoteTiming] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propRes, voteRes] = await Promise.all([
                    apiGet("governance/proposals"),
                    apiGet("governance/vote-timing"),
                ]);
                if (propRes.ok) setProposals(await propRes.json());
                if (voteRes.ok) setVoteTiming(await voteRes.json());
            } catch (e) {
                console.error("Failed to fetch governance data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                            <th>Threshold%</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposals.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td title={p.actionSummary}>
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
                                <td>{p.thresholdPct}%</td>
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

            {proposals.length > 0 && (
                <>
                    <h3 className="title is-5 mt-5">
                        Proposal Statistics
                    </h3>
                    <ProposalStatsChart proposals={proposals} />
                </>
            )}

            {voteTiming && proposals.length > 0 && (
                <>
                    <h3 className="title is-5 mt-5">Vote Timing</h3>
                    <VoteTimingChart
                        votes={voteTiming.votes}
                        attestingWindows={voteTiming.attestingWindows}
                        proposals={proposals}
                    />
                </>
            )}
        </PublicLayout>
    );
};

export default GovernanceDashboard;
