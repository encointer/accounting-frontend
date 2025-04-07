import PublicLayout from "./PublicLayout";
import RewardsChart from "./RewardsChart";
import SankeyChart from "./SankeyChart";

const Home = () => {
  return (
    <PublicLayout>
      <br/>
      <big>Leu Zürich Rewards Overview</big>
      <br/>
      <br/>
      <RewardsChart cid="u0qj944rhWE"/>
      <br/>
      <big>Nyota Rewards Overview</big>
      <br/>
      <br/>
      <RewardsChart cid="kygch5kVGq7"/>
      <br/>
      <big>Paynuq Rewards Overview</big>
      <br/>
      <br/>
      <RewardsChart cid="s1vrqQL2SD"/>
      <br/>
      <big>Greenbay Dollar Rewards Overview</big>
      <br/>
      <br/>
      <RewardsChart cid="dpcmj33LUs9"/>
    </PublicLayout>
  );
};

export default Home;
