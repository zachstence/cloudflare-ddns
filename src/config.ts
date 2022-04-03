import _config from "config";

export const config = {
    cloudflare: {
        apiToken: _config.get<string>("cloudflare.apiToken"),
        zoneId: _config.get<string>("cloudflare.zoneId"),
        recordName: _config.get<string>("cloudflare.recordName"),
    },
    interval: _config.get<number>("interval"),
};
