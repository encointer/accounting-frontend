import { useEffect, useState, useCallback } from "react";
import Spinner from "./Spinner";
import { apiGet } from "../api";

function formatDate(iso) {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

function accountLabel(acc) {
    if (acc.medium === "card") {
        const last4 = acc.details?.card_last_four || "????";
        const provider = acc.details?.card_provider || "";
        return `${provider} **** ${last4}`.trim();
    }
    return acc.metadata?.name || acc.urn;
}

function formatBalance(balance) {
    if (!balance) return null;
    return Object.entries(balance)
        .map(([asset, b]) => `${b.current} ${asset}`)
        .join(", ");
}

const CardTransactions = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedUrn, setSelectedUrn] = useState(null);
    const [movements, setMovements] = useState([]);
    const [nextToken, setNextToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [noCredentials, setNoCredentials] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiGet("bloque/accounts");
                if (res.status === 404) {
                    setNoCredentials(true);
                    return;
                }
                if (!res.ok) throw new Error("Failed to fetch accounts");
                const data = await res.json();
                const list = data.accounts || data;
                const arr = Array.isArray(list) ? list : [];
                setAccounts(arr);
                if (arr.length > 0) setSelectedUrn(arr[0].urn);
            } catch (e) {
                console.error(e);
                setError("Failed to load account data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const fetchMovements = useCallback(async (urn, token) => {
        const params = token ? `?next=${encodeURIComponent(token)}` : "";
        const res = await apiGet(
            `bloque/accounts/${encodeURIComponent(urn)}/movements${params}`
        );
        if (!res.ok) throw new Error("Failed to fetch movements");
        return res.json();
    }, []);

    useEffect(() => {
        if (!selectedUrn) return;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchMovements(selectedUrn, null);
                setMovements(data.movements || []);
                setNextToken(data.next || null);
            } catch (e) {
                console.error(e);
                setError("Failed to load movements.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [selectedUrn, fetchMovements]);

    const handleLoadMore = async () => {
        setLoadingMore(true);
        try {
            const data = await fetchMovements(selectedUrn, nextToken);
            setMovements((prev) => [...prev, ...(data.movements || [])]);
            setNextToken(data.next || null);
        } catch (e) {
            console.error(e);
            setError("Failed to load more movements.");
        } finally {
            setLoadingMore(false);
        }
    };

    if (noCredentials) {
        return (
            <p>No Bloque account linked. Contact admin to set up your access.</p>
        );
    }

    if (loading && movements.length === 0) return <Spinner />;
    if (error) return <p className="has-text-danger">{error}</p>;
    if (!loading && accounts.length === 0) {
        return <p>No Bloque accounts found.</p>;
    }

    const selected = accounts.find((a) => a.urn === selectedUrn);

    return (
        <>
            {accounts.length > 1 && (
                <div className="field">
                    <div className="control">
                        <div className="select">
                            <select
                                value={selectedUrn || ""}
                                onChange={(e) => setSelectedUrn(e.target.value)}
                            >
                                {accounts.map((a) => (
                                    <option key={a.urn} value={a.urn}>
                                        [{a.medium}] {accountLabel(a)} - {a.status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {selected && (
                <div className="box" style={{ marginBottom: "1rem" }}>
                    <p>
                        <strong>Account:</strong> {accountLabel(selected)}
                    </p>
                    <p>
                        <strong>Medium:</strong> {selected.medium}
                    </p>
                    {selected.medium === "card" && (
                        <>
                            <p>
                                <strong>Card type:</strong> {selected.details?.card_type || "VIRTUAL"} / {selected.details?.card_product_type || "CREDIT"}
                            </p>
                            <p>
                                <strong>Card status:</strong> {selected.details?.card_status || selected.status}
                            </p>
                        </>
                    )}
                    {selected.medium === "virtual" && (
                        <p>
                            <strong>Status:</strong> {selected.status}
                        </p>
                    )}
                    {selected.balance && (
                        <p>
                            <strong>Balance:</strong> {formatBalance(selected.balance)}
                        </p>
                    )}
                    {selected.details?.card_url_details && (
                        <p>
                            <a href={selected.details.card_url_details} target="_blank" rel="noreferrer">
                                View full card details
                            </a>
                        </p>
                    )}
                </div>
            )}

            {movements.length === 0 && !loading && (
                <p>No movements found for this account.</p>
            )}

            {movements.length > 0 && (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Direction</th>
                                <th>Amount</th>
                                <th>Reference</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.map((m, i) => {
                                const isIn = m.direction === "in";
                                const amount = parseFloat(m.amount);
                                return (
                                    <tr key={i}>
                                        <td>{formatDate(m.createdAt || m.created_at)}</td>
                                        <td>{m.type}</td>
                                        <td style={{ color: isIn ? "green" : "red" }}>
                                            {isIn ? "IN" : "OUT"}
                                        </td>
                                        <td style={{ color: isIn ? "green" : "red" }}>
                                            {isIn ? "+" : "-"}
                                            {isNaN(amount) ? m.amount : amount.toFixed(2)}{" "}
                                            {m.asset}
                                        </td>
                                        <td>{m.reference || "-"}</td>
                                        <td>{m.status}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {nextToken && (
                        <button
                            className="button is-link"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? "Loading..." : "Load more"}
                        </button>
                    )}
                </>
            )}
        </>
    );
};

export default CardTransactions;
