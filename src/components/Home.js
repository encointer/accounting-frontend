import PublicLayout from "./PublicLayout";
import CeremonyParticipationChart from "./CeremonyParticipationChart";

const Home = () => {
  return (
    <PublicLayout>
      <br/>
      <big>Ceremony Participation Over Time</big>
      <br/>
      <br/>
      <CeremonyParticipationChart />
    </PublicLayout>
  );
};

export default Home;
