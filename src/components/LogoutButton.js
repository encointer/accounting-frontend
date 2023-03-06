import { Link } from "react-router-dom";
import { apiGet } from "../api";

function LogoutButton({ me }) {
    return (
        <div>
            {me?.address && (
                <div className="column is-narrow has-background-light m-1">
                    <Link
                        onClick={async () => {
                            await apiGet("auth/logout");
                            window.location.href = '/';
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
