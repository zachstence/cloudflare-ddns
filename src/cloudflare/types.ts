export interface CloudflareResponse<T> {
    result: T;
    success: boolean;
    errors: string[];
    messages: string[];
    result_info: any;
}

export interface DnsRecord {
    id: string;
    content: string;
}
