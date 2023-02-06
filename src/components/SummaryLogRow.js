import { round } from "../util";

const SummaryLogRow = ({
    month,
    incomeMinusExpenses,
    sumIssues,
    balance,
    numIncoming,
    numOutgoing,
    numIssues,
    numDistinctClients,
    costDemurrage,
    avgTxnValue,
}) => {
    return (
        <tr>
            <td>{month}</td>
            <td>{round(incomeMinusExpenses)}</td>
            <td>{round(sumIssues)}</td>
            <td>{round(balance)}</td>
            <td>{round(costDemurrage)}</td>
            <td>{numIncoming}</td>
            <td>{numOutgoing}</td>
            <td>{numIssues}</td>
            <td>{numDistinctClients}</td>
            <td>{round(avgTxnValue)}</td>

            {/* <td><button className="button is-link">Download Transaction Log</button></td> */}
        </tr>
    );
};

export default SummaryLogRow;
