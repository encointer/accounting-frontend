import { Link } from "react-router-dom";
import { apiGet } from "../api";

function LogoutButton({ me }) {
    return (
        <div>
            {me?.address && (
                <div className="column is-narrow has-background-light m-1">
                    <Link
                        onClick={() => {
                            apiGet("auth/logout");
                        }}
                    >
                        Logout
                    </Link>
                </div>
            )}
        </div>
    );
}

export default LogoutButton;
