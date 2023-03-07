import InternalLayout from "./InternalLayout";
import { apiPost } from "../api";
import UserForm from "./UserForm";
import { useState } from "react";

const AddUser = () => {
    const [newUser, setNewUser] = useState({});
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const form = e.target.form;
        const res = await apiPost(`auth/users`, {
            address: form[0].value,
            name: form[1].value,
            cids: [form[2].value],
        });
        if (res.ok) {
            setNewUser(await res.json());
        }
    };

    return (
        <InternalLayout>
            <UserForm handleSubmit={handleSubmitForm} />
            {Object.keys(newUser).includes("address") && (
                <div>
                    <br />
                    <p>New User added!</p>
                    <p>Address: {newUser.address}</p>
                    <p>Password: {newUser.password}</p>
                </div>
            )}
        </InternalLayout>
    );
};

export default AddUser;
