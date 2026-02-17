import { useContext, useEffect, useState, useCallback } from "react";
import PublicInternalLayout from "./PublicInternalLayout";
import Spinner from "./Spinner";
import { apiGet } from "../api";
import { MeContext } from "../App";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const BATCH_SIZE = 50;

function deriveType(entry) {
    if (entry.foreignAssetName) return "Swap";
    const cp = entry.counterParty;
    if (cp === "ISSUANCE") return "Issuance";
    if (cp === "TREASURY") return "Treasury Spend";
    if (cp === "XCMteleporter") return "XCM";
    if (cp === "FaucetDrip") return "Faucet Drip";
    return "Transfer";
}

function formatDate(timestamp) {
    const d = new Date(parseInt(timestamp));
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

function deduplicate(entries) {
    const seen = new Set();
    return entries.filter((e) => {
        const key = `${e.blockNumber}|${e.timestamp}|${e.counterParty}|${e.amount}|${e.currency}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

async function fetchAllTransactions(address, start, end) {
    const commRes = await apiGet("communities/all-communities");
    if (!commRes.ok) throw new Error("Failed to fetch communities.");
    const communities = await commRes.json();

    const communityPromises = communities.map(async ({ cid, name }) => {
        const res = await apiGet(
            `accounting/transaction-log?cid=${cid}&account=${address}&start=${start}&end=${end}`
        );
        if (!res.ok) return [];
        const entries = await res.json();
        return entries.map((e) => ({
            ...e,
            currency: e.foreignAssetName || name,
        }));
    });

    const nativePromise = apiGet(
        `accounting/native-transaction-log?account=${address}&start=${start}&end=${end}`
    ).then(async (res) => {
        if (!res.ok) return [];
        const entries = await res.json();
        return entries.map((e) => ({ ...e, currency: "KSM (native)" }));
    });

    const results = await Promise.all([...communityPromises, nativePromise]);
    const merged = results.flat();
    return deduplicate(merged);
}

const TransactionHistory = () => {
    const { me } = useContext(MeContext);
    const [transactions, setTransactions] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [yearsLoaded, setYearsLoaded] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const loadTransactions = useCallback(
        async (years) => {
            const now = Date.now();
            const start = now - (years + 1) * ONE_YEAR_MS;
            const end = years === 0 ? now : now - years * ONE_YEAR_MS;

            const entries = await fetchAllTransactions(me.address, start, end);
            return entries;
        },
        [me.address]
    );

    useEffect(() => {
        if (!me.address) return;

        const init = async () => {
            setShowSpinner(true);
            setError(null);
            try {
                const entries = await loadTransactions(0);
                const sorted = entries.sort(
                    (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
                );
                setTransactions(sorted.slice(0, BATCH_SIZE));
                setYearsLoaded(1);
                setHasMore(sorted.length >= BATCH_SIZE);
            } catch (e) {
                console.error(e);
                setError("Failed to fetch transactions.");
            } finally {
                setShowSpinner(false);
            }
        };

        init();
    }, [me.address, loadTransactions]);

    const handleLoadMore = async () => {
        setLoadingMore(true);
        try {
            const entries = await loadTransactions(yearsLoaded);
            if (entries.length === 0) {
                setHasMore(false);
            } else {
                const merged = deduplicate([...transactions, ...entries]);
                merged.sort(
                    (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
                );
                setTransactions(merged);
                setHasMore(entries.length >= BATCH_SIZE);
            }
            setYearsLoaded((y) => y + 1);
        } catch (e) {
            console.error(e);
            setError("Failed to load more transactions.");
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <PublicInternalLayout>
            <p className="title is-4">Transaction History</p>
            {showSpinner && <Spinner />}
            {error && <p className="has-text-danger">{error}</p>}
            {!showSpinner && !error && transactions.length === 0 && me.address && (
                <p>No transactions found in the last year.</p>
            )}
            {transactions.length > 0 && (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Counterparty</th>
                                <th>Amount</th>
                                <th>Currency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, i) => {
                                const amount = parseFloat(tx.amount);
                                return (
                                    <tr key={i}>
                                        <td>{formatDate(tx.timestamp)}</td>
                                        <td>{deriveType(tx)}</td>
                                        <td>{tx.counterParty}</td>
                                        <td
                                            style={{
                                                color: amount >= 0 ? "green" : "red",
                                            }}
                                        >
                                            {amount >= 0 ? "+" : ""}
                                            {amount.toFixed(2)}
                                        </td>
                                        <td>{tx.currency}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {hasMore && (
                        <button
                            className="button is-link"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? "Loading..." : "Load earlier transactions"}
                        </button>
                    )}
                </>
            )}
        </PublicInternalLayout>
    );
};

export default TransactionHistory;
