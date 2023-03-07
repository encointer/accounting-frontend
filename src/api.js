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

export async function apiPost(path, body) {
    const res = await fetch(`${API_URL}/${path}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
    });
    return res;
}
