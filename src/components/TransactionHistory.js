import { useContext, useEffect, useState } from "react";
import PublicInternalLayout from "./PublicInternalLayout";
import Spinner from "./Spinner";
import { apiGet } from "../api";
import { MeContext } from "../App";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const MAX_TRANSACTIONS = 50;

function deriveType(entry) {
    if (entry.foreignAssetName) return "Swap";
    const cp = entry.counterParty;
    if (cp === "ISSUANCE") return "Issuance";
    if (cp === "TREASURY") return "Treasury Spend";
    if (cp === "XCMteleporter") return "XCM";
    if (cp === "FaucetDrip") return "Faucet Drip";
    return "Transfer";
}

function truncateAddress(addr) {
    if (!addr || addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatCounterparty(entry) {
    const cp = entry.counterParty;
    if (["ISSUANCE", "TREASURY", "XCMteleporter", "FaucetDrip"].includes(cp)) {
        return cp;
    }
    return truncateAddress(cp);
}

const TransactionHistory = () => {
    const { me } = useContext(MeContext);
    const [transactions, setTransactions] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!me.address) return;

        const fetchTransactions = async () => {
            setShowSpinner(true);
            setError(null);

            const now = Date.now();
            const start = now - ONE_YEAR_MS;

            try {
                const commRes = await apiGet("communities/all-communities");
                if (!commRes.ok) {
                    setError("Failed to fetch communities.");
                    setShowSpinner(false);
                    return;
                }
                const communities = await commRes.json();

                const communityPromises = communities.map(async ({ cid, name }) => {
                    const res = await apiGet(
                        `accounting/transaction-log?cid=${cid}&account=${me.address}&start=${start}&end=${now}`
                    );
                    if (!res.ok) return [];
                    const entries = await res.json();
                    return entries.map((e) => ({
                        ...e,
                        currency: e.foreignAssetName || name,
                    }));
                });

                const nativePromise = apiGet(
                    `accounting/native-transaction-log?account=${me.address}&start=${start}&end=${now}`
                ).then(async (res) => {
                    if (!res.ok) return [];
                    const entries = await res.json();
                    return entries.map((e) => ({ ...e, currency: "KSM (native)" }));
                });

                const results = await Promise.all([...communityPromises, nativePromise]);
                const merged = results.flat();
                merged.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));

                setTransactions(merged.slice(0, MAX_TRANSACTIONS));
            } catch (e) {
                console.error(e);
                setError("Failed to fetch transactions.");
            } finally {
                setShowSpinner(false);
            }
        };

        fetchTransactions();
    }, [me.address]);

    return (
        <PublicInternalLayout>
            <p className="title is-4">Transaction History</p>
            {showSpinner && <Spinner />}
            {error && <p className="has-text-danger">{error}</p>}
            {!showSpinner && !error && transactions.length === 0 && me.address && (
                <p>No transactions found in the last year.</p>
            )}
            {transactions.length > 0 && (
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
                                    <td>
                                        {new Date(parseInt(tx.timestamp)).toLocaleString()}
                                    </td>
                                    <td>{deriveType(tx)}</td>
                                    <td>{formatCounterparty(tx)}</td>
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
            )}
        </PublicInternalLayout>
    );
};

export default TransactionHistory;
