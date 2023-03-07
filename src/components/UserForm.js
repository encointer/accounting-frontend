import CidSelect from "./CidSelect";

const UserForm = ({ handleSubmit, address, name, cid }) => {
    return (
        <form>
            <h1>Add User</h1>
            <br />
            <div>
                <div>
                    <label>Address: </label>
                    <br />
                    <input
                        type="text"
                        placeholder="Address"
                        name="address"
                        defaultValue={address}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Name: </label>
                    <br />
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        defaultValue={name}
                        required
                    />
                </div>
                <br />
                <CidSelect value={cid} />
                <button
                    className="button is-link"
                    type="submit"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default UserForm;
