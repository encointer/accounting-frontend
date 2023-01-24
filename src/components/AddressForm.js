const AddressForm = ({}) => {
    return (
        <div>
            <div class="field">
                <label class="label">Address</label>
                <div class="control">
                    <input class="input" type="text" placeholder="Text input" />
                </div>
            </div>
            <div class="field">
                <label class="label">CID</label>
                <div class="control">
                    <div class="select">
                        <select>
                            <option>LEU</option>
                            <option>Aslah</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="field">
                <label class="label">Password</label>
                <div class="control">
                    <input class="input" type="text" placeholder="Text input" />
                </div>
            </div>

            <div class="field is-grouped">
                <div class="control">
                    <button class="button is-link">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default AddressForm;
