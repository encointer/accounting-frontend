import { apiPost } from "../api";
import { useState } from "react";
import PublicInternalLayout from "./PublicInternalLayout";

const ChangePassword = () => {
    const [message, setMessage] = useState("");
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const form = e.target.form;
        const password = form[0].value;
        const password2 = form[1].value;
        const newPassword = form[2].value;

        if (password !== password2) {
            setMessage("Error: Passwords do not match.");
            return;
        }

        const res = await apiPost(`auth/change-password`, {
            password,
            newPassword,
        });
        if (res.ok) {
            form.reset();
            setMessage("Password successfully changed.");
        }
    };

    return (
        <PublicInternalLayout>
            <form>
                <h1>Change Password</h1>
                <br />
                <div>
                    <div>
                        <label>Old Password: </label>
                        <br />
                        <input
                            type="password"
                            placeholder="Old Password"
                            name="password"
                            required
                        />
                    </div>
                    <br />

                    <div>
                        <label>Confirm Old Password: </label>
                        <br />
                        <input
                            type="password"
                            placeholder="Confirm Old Password"
                            name="password2"
                            required
                        />
                    </div>
                    <br />
                    <div>
                        <label>New Password: </label>
                        <br />
                        <input
                            type="password"
                            placeholder="New Password"
                            name="newPassword"
                            required
                        />
                    </div>
                    <br />
                    <button
                        className="button is-link"
                        type="submit"
                        onClick={handleSubmitForm}
                    >
                        Submit
                    </button>
                </div>
            </form>
            <p>{message}</p>
        </PublicInternalLayout>
    );
};

export default ChangePassword;
