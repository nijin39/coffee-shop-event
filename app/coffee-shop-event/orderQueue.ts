import * as router from 'aws-lambda-router'
import {StickerController} from "./ui/sticker/StickerController";

const stickerController = StickerController.getInstance;
const orderQueue = String(process.env.ORDER_QUEUE)

export const handler = router.handler({
    sqs: {
        routes: [
            {
                source: orderQueue,
                action: (messages, context, records) =>
                    messages.forEach(message => {
                        stickerController.addStickerHistory(message);
                        console.log(JSON.parse(message));
                    })
            }
        ]
    }
})