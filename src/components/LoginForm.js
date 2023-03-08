import { API_URL } from "../consts";

function LoginForm({ setMe }) {
    const authenticate = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/auth/authenticate`, {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: e.target.form[0].value,
                password: e.target.form[1].value,
            }),
        });
        if ([401, 403].includes(res.status)) {
            return;
        }
        const me = await res.json();
        setMe(me);
    };

    return (
        <form>
            <h1>Login</h1>
            <br />
            <div>
                <div>
                    <label>Address : </label>
                    <br />
                    <input
                        type="text"
                        placeholder="Address"
                        name="username"
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Password : </label>
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        required
                    />
                </div>
                <br />
                <button
                    className="button is-link"
                    type="submit"
                    onClick={authenticate}
                >
                    Login
                </button>
            </div>
        </form>
    );
}

export default LoginForm;
