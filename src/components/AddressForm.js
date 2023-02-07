import CidSelect from "./CidSelect";

const AddressForm = ({ handleSubmit }) => {
    return (
        <form>
            <div style={{ width: "min(100%, 600px)" }}>
                <div className="field">
                    <label>Address</label>
                    <div className="control">
                        <input className="input" type="text" name="address" />
                    </div>
                </div>
                <CidSelect />
                <div className="field">
                    <label>Password</label>
                    <div className="control">
                        <input className="input" type="password" name="token" />
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button
                            className="button is-link"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddressForm;
