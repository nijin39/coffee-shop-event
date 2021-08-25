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
                action: async (messages, context, records) => {
                    // const promises = messages.map(stickerController.addStickerHistory(JSON.parse(message)));
                    // await Promise.all(promises);
                    for ( const message of messages ) {
                        await stickerController.addStickerHistory(JSON.parse(message));
                    }
                }

                    // messages.forEach(async message => {
                    //     console.log("MESSAGE :", JSON.stringify(message));
                    //     await stickerController.addStickerHistory(JSON.parse(message));
                    // })
            }
        ]
    }
})