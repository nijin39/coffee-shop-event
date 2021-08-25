import * as router from 'aws-lambda-router'
import {StickerController} from "./ui/sticker/StickerController";
import {StickerAddCommand} from "./domain/sticker/command/StickerAddCommand";

const stickerController = StickerController.getInstance;
const orderQueue = String(process.env.ORDER_QUEUE)

export const handler = router.handler({
    sqs: {
        routes: [
            {
                source: orderQueue,
                action: (messages, context, records) =>
                    messages.forEach(async message => {
                        await stickerController.addStickerHistory(JSON.parse(message));
                    })
            }
        ]
    }
})