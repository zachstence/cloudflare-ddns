import { z } from "zod";
import fs from 'fs'

const CloudflareZoneSchema = z.object({
    zoneId: z.string().min(1, { message: 'zoneId is required' }),
    recordNames: z.array(z.string().min(1)),
})
export type CloudflareZone = z.infer<typeof CloudflareZoneSchema>

const ConfigSchema = z.object({
    cloudflare: z.object({
        apiToken: z.string().min(1, { message: 'apiToken is required'})
    }),
    zones: z.array(CloudflareZoneSchema),
    intervalSeconds: z.number().min(1, { message: 'intervalSeconds must be at least 1'}),
})
export type Config = z.infer<typeof ConfigSchema>

const raw = JSON.parse(fs.readFileSync('./config.json').toString())
export const config = ConfigSchema.parse(raw)
