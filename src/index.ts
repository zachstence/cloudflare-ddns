import { editRecord, getRecord, listRecords } from "./cloudflare";
import { getIp } from "./ipify";

const ZONE_ID = "";

const RECORD_NAME = "";

const INTERVAL = 1; // minutes

let logged: boolean = false;

const run = async () => {
    try {
        const expectedIp = await getIp();
    
        const records = await listRecords(ZONE_ID, RECORD_NAME);
        if (!records.length) throw new Error(`No DNS records found matching zoneId=${ZONE_ID} name=${RECORD_NAME}`);
        const record = records[0];
        
        const { id, content } = record;
        if (content !== expectedIp) {
            console.log(`Updating DNS record with id=${id} (${RECORD_NAME}) from '${content}' to '${expectedIp}'`);
            await editRecord(ZONE_ID, id, expectedIp);

            const editedRecord = await getRecord(ZONE_ID, id);
            if (editedRecord.content !== expectedIp) throw new Error("DNS record update failed");

            logged = false;
        } else if (!logged) {
            console.log(`DNS record content matches your current public IP, nothing more to do. Checking every ${INTERVAL} minutes, but not logging unless an update is necessary.`)
            logged = true;
        }
    } catch (e) {
        console.error("DNS query/update failed:\n", e);
    }
};

run();
