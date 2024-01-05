import { editRecord, getRecordById, getRecordByName } from "./cloudflare";
import { getIp } from "./ipify";
import { config } from "./config";

const { zones, intervalSeconds } = config;
const intervalMs = Math.round(intervalSeconds * 1000);
const recordNames = zones.flatMap(zone => zone.recordNames)

let doLogByRecordName = recordNames.reduce<Record<string, boolean>>((obj, recordName) => { obj[recordName] = true; return obj }, {});

const syncRecord = async (zoneId: string, recordName: string, expectedIp: string): Promise<void> => {
    const logInfo = (...args: any[]): void => console.log(`[${recordName}]`, ...args)
    const logError = (...args: any[]): void => console.error(`[${recordName}]`, ...args)

    try {
        const record = await getRecordByName(zoneId, recordName);
        const { id, content } = record;
        
        if (content !== expectedIp) {
            logInfo(`Updating DNS record with id=${id} from '${content}' to '${expectedIp}'`);
            await editRecord(zoneId, id, expectedIp);
    
            const editedRecord = await getRecordById(zoneId, id);
            if (editedRecord.content !== expectedIp) {
                logError("DNS record update failed");
                return
            }
    
            logInfo("Success!");
            doLogByRecordName[recordName] = true
        } else if (doLogByRecordName[recordName]) {
            logInfo(`DNS record content matches your current public IP, nothing more to do. Checking every ${intervalSeconds} seconds, but not logging unless an update is necessary.`)
            doLogByRecordName[recordName] = false;
        }
    } catch (e) {
        logError(`Failed to sync DNS`, e)
    }
}

const run = async () => {
    let expectedIp: string
    try {
        expectedIp = await getIp();
    } catch (e) {
        console.error("Failed to get expected IP\n", e);
        return
    }

    for (const zone of config.zones) {
        for (const recordName of zone.recordNames) {
            await syncRecord(zone.zoneId, recordName, expectedIp)
        }
    }
};

//////////////////////

console.log(`cloudflare-ddns started! Checking DNS for ${recordNames.length} records every ${intervalSeconds} seconds...`);
run();
setInterval(run, intervalMs);
