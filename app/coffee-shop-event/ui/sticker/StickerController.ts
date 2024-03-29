import { StickerAddCommand } from "../../domain/sticker/command/StickerAddCommand";
import {StickerService} from "../../application/sticker/StickerService";
import {StickerHistory} from "../../domain/sticker/model/StickerHistory";
import {Customer} from "../../domain/customer/model/Customer";
import {StickerPresentCommand} from "../../domain/sticker/command/StickerPresentCommand";

export class StickerController {

    private static instance: StickerController;
    private stickerService: StickerService;

    private constructor() {
        this.stickerService = StickerService.getInstance;
    }

    static get getInstance() {
        if (!StickerController.instance) {
            StickerController.instance = new StickerController();
        }
        return this.instance;
    }

    async addStickerHistory(message: StickerAddCommand):Promise<StickerHistory> {
        return await this.stickerService.addStickerHistory(message);
    }

    // async stickerPresent(message: StickerPresentCommand):Promise<Customer> {
    //     return await this.stickerService.stickerPresent(message);
    // }

}