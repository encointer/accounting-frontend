import { Link } from "react-router-dom";

const PublicLayout = ({ children }) => {
    return (
        <div
            style={{
                width: "100vw",
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
                    <Link to="/">
                        <img
                            style={{
                                marginTop: "15px",
                                width: "150px",
                            }}
                            src={`logos/encointerLogoLeuColors.png`}
                            alt="Logo"
                        />
                    </Link>
                </div>
                <>
                    <div className="column"></div>
                    <div className="column is-narrow has-background-light m-1">
                        <Link to="/account-report">Login</Link>
                    </div>
                </>
            </div>

            <div className="is-align-items-flex-start"> {children}</div>

            <footer>
                <br />
                <br />
                <br />© 2025 Encointer Association
            </footer>
        </div>
    );
};

export default PublicLayout;
