import axios from "axios"

const api = axios.create({
    baseURL: "https://api.ipify.org"
});

export const getIp = async (): Promise<string> => {
    const res = await api.get("/");
    return res.data;
}
