import { Link } from "react-router-dom";

const InternalLayout = ({ children }) => {
    return (
        <div
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
                            src="logos/encointerLogoLeuColors.png"
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
                <div className="column is-narrow has-background-light m-1">
                    <Link to="/rewards-report">Rewards Report</Link>
                </div>
                <div className="column is-narrow has-background-light m-1">
                    <Link to="/account-tokens">Tokens</Link>
                </div>
            </div>{" "}
            <div className="is-align-items-flex-start"> {children}</div>
            <footer>
                <br />
                <br />
                <br />© 2023 Encointer Association
            </footer>
        </div>
    );
};

export default InternalLayout;
