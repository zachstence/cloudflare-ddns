import { editRecord, getRecord, listRecords } from "./cloudflare";
import { getIp } from "./ipify";
import { config } from "./config";

const { interval, cloudflare } = config;
const { zoneId, recordName } = cloudflare;

const intervalMs = Math.round(interval * 60 * 1000);

let doLog: boolean = true;

console.log(`App started! Checking DNS for '${recordName}' every ${interval} minutes...`);

const run = async () => {
    try {
        const expectedIp = await getIp();
    
        const records = await listRecords(zoneId, recordName);
        if (!records.length) throw new Error(`No DNS records found matching zoneId=${zoneId} name=${recordName}`);
        const record = records[0];
        
        const { id, content } = record;
        if (content !== expectedIp) {
            console.log(`Updating DNS record with id=${id} (${recordName}) from '${content}' to '${expectedIp}'`);
            await editRecord(zoneId, id, expectedIp);

            const editedRecord = await getRecord(zoneId, id);
            if (editedRecord.content !== expectedIp) throw new Error("DNS record update failed");

            console.log("Success!");
            doLog = true;
        } else if (doLog) {
            console.log(`DNS record content matches your current public IP, nothing more to do. Checking every ${interval} minutes, but not logging unless an update is necessary.`)
            doLog = false;
        }
    } catch (e) {
        console.error("DNS query/update failed:\n", e);
    }
};

run();
setInterval(run, intervalMs);
