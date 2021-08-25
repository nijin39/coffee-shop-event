import {StickerAddCommand} from "../command/StickerAddCommand";


export class StickerHistory {
    customerId: string;
    productionType: string;
    orderType: string;
    orderTimestamp: string;

    constructor(stickerAddCommand: StickerAddCommand) {
        this.customerId = stickerAddCommand.customerId;
        this.productionType = stickerAddCommand.productionType;
        this.orderType = stickerAddCommand.orderType;
        this.orderTimestamp = stickerAddCommand.timestamp;
    }
}