import CidSelect from "./CidSelect";

const AddressForm = ({ handleSubmit }) => {
    return (
        <form>
            <div>
                <div className="field">
                    <label>Address</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            name="address"
                        />
                    </div>
                </div>
                <CidSelect/>
                <div className="field">
                    <label>Password</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            name="token"
                        />
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button className="button is-link" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddressForm;
