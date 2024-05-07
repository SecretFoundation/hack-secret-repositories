import { test, describe} from 'vitest';
import { loadConfig } from './config';
import { consumerClient, secretClient } from './clients';
import { sendIBCToken } from './ibc';
import { getPermit, sleep } from './utils';
import { CONSUMER_CHAIN_ID, CONSUMER_TOKEN } from './env';

describe('Execute remote contract', () => {

    test("If can trigger contract on Secret using hooks", async () => {

        const config = loadConfig();

        const contract_address = config.contract_info!.contract_address!;

        const permit =  await getPermit(
            consumerClient,
            contract_address,
            CONSUMER_CHAIN_ID
        )


        const msg = {
            wasm: {
                contract: contract_address!,
                msg: {
                    update_my_random_number: {
                        permit
                    }
                }
            }
        }

        await sendIBCToken(
            consumerClient,
            contract_address,
            CONSUMER_TOKEN,
            "2",
            config.ibc_info?.consumer_channel!,
            JSON.stringify(msg)
        )


        await sleep(500);

        try {
            const res = await secretClient.query.compute.queryContract({
                contract_address: config.contract_info!.contract_address!,
                code_hash: config.contract_info!.code_hash,
                query: {
                    get_my_random_number: { permit }
                }
            })
            console.log("query rarndom number:", res)
        } catch (e) {
            console.log("query rn error:", e)
        }

    })

});
