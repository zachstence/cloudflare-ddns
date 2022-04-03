import axios from "axios";
import { CloudflareResponse, DnsRecord } from "./types";

const API_TOKEN = "";

const api = axios.create({
    baseURL: "https://api.cloudflare.com/client/v4",
    headers: {
        Authorization: `Bearer ${API_TOKEN}`,
    },
});

export const listRecords = async (zoneId: string, name?: string): Promise<DnsRecord[]> => {
    const res = await api.get<CloudflareResponse<DnsRecord[]>>(`/zones/${zoneId}/dns_records`, {
        params: { name },
    });
    
    if (!res.data.success) throw res.data.errors;

    return res.data.result;
};

export const getRecord = async (zoneId: string, recordId: string): Promise<DnsRecord> => {
    const res = await api.get<CloudflareResponse<DnsRecord>>(`/zones/${zoneId}/dns_records/${recordId}`);

    if (!res.data.success) throw res.data.errors;

    return res.data.result;
}

export const editRecord = async (zoneId: string, recordId: string, content: string): Promise<void> => {
    const res = await api.patch<CloudflareResponse<unknown>>(`/zones/${zoneId}/dns_records/${recordId}`, { content });
    if (!res.data.success) throw res.data.errors;
}
