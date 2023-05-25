import PublicLayout from "./PublicLayout";
import RewardsChart from "./RewardsChart";

const Home = () => {
    return (
        <PublicLayout>
            <br/>
            <big>Leu Zürich Rewards Overview</big>
            <br/>
            <br/>
            <RewardsChart cid="u0qj944rhWE"/>
            <br/>
            <big>Greenbay Dollar Rewards Overview</big>
            <br/>
            <br/>
            <RewardsChart cid="dpcmj33LUs9"/>
        </PublicLayout>
    );
};

export default Home;
