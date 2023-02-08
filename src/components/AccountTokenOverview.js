import AccountTokenCommunityOverview from "./AccountTokenCommunityOverview";

const AccountTokenOverview = ({ data }) => {
    return (
        <div>
            {Object.values(data).map((communityData, i) => (
                <AccountTokenCommunityOverview key={i} data={communityData} />
            ))}
        </div>
    );
};

export default AccountTokenOverview;
