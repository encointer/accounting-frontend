import "bulma/css/bulma.min.css";
import Layout from "./Layout";

const Home = () => {
    return (
        <Layout>
            <div className="container" style={{ width: "100%" }}>
                <big>Welcome to the Encointer accounting app.</big>
            </div>
        </Layout>
    );
};

export default Home;
