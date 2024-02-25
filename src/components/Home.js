import PublicLayout from "./PublicLayout";
import RewardsChart from "./RewardsChart";
import SankeyChart from "./SankeyChart";

const Home = () => {
    return (
        <PublicLayout>
            <SankeyChart/>
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
            <br/>
            <big>Nyota Rewards Overview</big>
            <br/>
            <br/>
            <RewardsChart cid="kygch5kVGq7"/>
        </PublicLayout>
    );
};

export default Home;
