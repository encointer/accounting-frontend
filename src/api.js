import { API_URL } from "./consts";

export async function apiGet(path, token) {
    const res = await fetch(`${API_URL}/${path}`, {
        headers: new Headers({
            "Access-Token": token,
        }),
        credentials: "include",
    });
    return res;
}
