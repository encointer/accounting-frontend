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

const CardTransactions = () => {
    const [cards, setCards] = useState([]);
    const [selectedUrn, setSelectedUrn] = useState(null);
    const [movements, setMovements] = useState([]);
    const [nextToken, setNextToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [noCredentials, setNoCredentials] = useState(false);

    useEffect(() => {
        const fetchCards = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiGet("bloque/cards");
                if (res.status === 404) {
                    setNoCredentials(true);
                    return;
                }
                if (!res.ok) throw new Error("Failed to fetch cards");
                const data = await res.json();
                const cardList = data.accounts || data;
                setCards(Array.isArray(cardList) ? cardList : []);
                if (Array.isArray(cardList) && cardList.length > 0) {
                    setSelectedUrn(cardList[0].urn);
                }
            } catch (e) {
                console.error(e);
                setError("Failed to load card data.");
            } finally {
                setLoading(false);
            }
        };
        fetchCards();
    }, []);

    const fetchMovements = useCallback(async (urn, token) => {
        const params = token ? `?next=${encodeURIComponent(token)}` : "";
        const res = await apiGet(
            `bloque/cards/${encodeURIComponent(urn)}/movements${params}`
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
            <p>No debit card linked. Contact admin to set up your card access.</p>
        );
    }

    if (loading && movements.length === 0) return <Spinner />;
    if (error) return <p className="has-text-danger">{error}</p>;

    const selectedCard = cards.find((c) => c.urn === selectedUrn);

    return (
        <>
            {cards.length > 1 && (
                <div className="field">
                    <div className="control">
                        <div className="select">
                            <select
                                value={selectedUrn || ""}
                                onChange={(e) => setSelectedUrn(e.target.value)}
                            >
                                {cards.map((c) => (
                                    <option key={c.urn} value={c.urn}>
                                        **** {c.lastFour || c.last_four || "????"} -{" "}
                                        {c.status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {selectedCard && (
                <div className="box" style={{ marginBottom: "1rem" }}>
                    <p>
                        <strong>Card:</strong> **** {selectedCard.lastFour || selectedCard.last_four || "????"}
                    </p>
                    <p>
                        <strong>Type:</strong> {selectedCard.medium || "card"} / {selectedCard.productType || selectedCard.product_type || "debit"}
                    </p>
                    <p>
                        <strong>Status:</strong> {selectedCard.status}
                    </p>
                    {(selectedCard.balance != null) && (
                        <p>
                            <strong>Balance:</strong> {selectedCard.balance} {selectedCard.asset || "DUSD"}
                        </p>
                    )}
                    {selectedCard.detailsUrl && (
                        <p>
                            <a href={selectedCard.detailsUrl} target="_blank" rel="noreferrer">
                                View full card details
                            </a>
                        </p>
                    )}
                </div>
            )}

            {movements.length === 0 && !loading && (
                <p>No movements found for this card.</p>
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
