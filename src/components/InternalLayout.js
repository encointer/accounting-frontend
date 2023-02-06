import { Link } from "react-router-dom";

const InternalLayout = ({ children }) => {
    return (
        <div
            className="main"
            style={{
                paddingLeft: "10vw",
                paddingRight: "10vw",
                minHeight: "100vh",
                margin: 0,
                display: "grid",
                gridTemplateRows: "auto 1fr auto",
            }}
        >
            <div className="columns is-vcentered">
                <div className="column is-3">
                    <Link to="/internal">
                        <img
                            src="https://encointer.org/wp-content/uploads/2022/03/Frame-4.png"
                            alt="Logo"
                        />
                    </Link>
                </div>
                <div className="column"></div>
                <div className="column is-narrow has-background-light m-1">
                    <Link to="/account-overview">Account Overview</Link>
                </div>
                <div className="column is-narrow has-background-light m-1">
                    <Link to="/turnover-report">Turnover Report</Link>
                </div>
            </div>
            {children}
            <footer>
                <br />
                <br />
                <br />© 2023 Encointer Association
            </footer>
        </div>
    );
};

export default InternalLayout;
