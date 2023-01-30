import { round } from "../util";

const AccountOverviewTable = ({ data, handleDownloadReport }) => {
    return (
        <div>
            <p style={{ fontSize: "3.5vh" }}>Account Overview</p>
            <button className="button is-link" onClick={handleDownloadReport}>
                Download Report
            </button>
            <br />
            <br />
            <table className="table">
                <thead>
                    <tr>
                        <th>Account</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i}>
                            <td>{row.account}</td>
                            <td>{round(row.balance)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccountOverviewTable;
