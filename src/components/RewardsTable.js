const RewardsTable = ({ data, handleDownloadReport }) => {
    return (
        <div>
            <p style={{ fontSize: "3.5vh" }}>Rewards Overview for {data.communityName}</p>
            <button className="button is-link" onClick={handleDownloadReport}>
                Download Report
            </button>
            <br />
            <br />
            <table className="table">
                <thead>
                    <tr>
                        <th>Cindex</th>
                        <th># Participants</th>
                        <th>Total Rewards</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.data).map(([cindex, row], i) => (
                        <tr key={i}>
                            <td>{cindex}</td>
                            <td>{row.numParticipants}</td>
                            <td>{row.totalRewards}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RewardsTable;
