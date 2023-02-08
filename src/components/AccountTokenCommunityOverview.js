const AccountTokenCommunityOverview = ({ data }) => {
    return (
        <div>
            <big>{data.name}</big>
            <table className="table" style={{ width: "80%" }}>
                <thead>
                    <tr>
                        <th>Account Name</th>
                        <th>Account</th>
                        <th>Access Token</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.accounts).map(([address, row], i) => (
                        <tr key={i}>
                            <td>{row.name}</td>
                            <td>{address}</td>
                            <td>{row.token}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccountTokenCommunityOverview;
