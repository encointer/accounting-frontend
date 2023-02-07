import { API_URL } from "./consts";

export async function apiGet(path, token) {
    const res = await fetch(`${API_URL}/${path}`, {
        headers: new Headers({
            Authorization: "Basic " + token,
        }),
    });
    return res;
}
