import * as router from 'aws-lambda-router'
import {StickerController} from "./ui/sticker/StickerController";

const stickerController = StickerController.getInstance;
const orderQueue = String(process.env.ORDER_QUEUE)

export const handler = router.handler({
    sqs: {
        routes: [
            {
                source: orderQueue,
                action: async (messages, context, records) => {
                    for ( const message of messages ) {
                        await stickerController.addStickerHistory(JSON.parse(message));
                    }
                }
            }
        ]
    }
})