import { apiGet } from "../api";
import InternalLayout from "./InternalLayout";

const LoginAs = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        await apiGet(`auth/login-as?account=${e.target.form[0].value}`);
    };

    return (
        <InternalLayout>
            <form>
                <div style={{ width: "min(100%, 600px)" }}>
                    <div>
                        <label>Address : </label>
                        <br />
                        <input
                            type="text"
                            placeholder="Address"
                            name="address"
                            required
                        />
                    </div>
                    <br />
                    <div className="control">
                        <button
                            className="button is-link"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </InternalLayout>
    );
};

export default LoginAs;
