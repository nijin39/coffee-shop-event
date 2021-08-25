import {StickerAddCommand} from "../../domain/sticker/command/StickerAddCommand";
import {StickerRepository} from "../../domain/sticker/service/StickerRepository";
import StickerDDBRepository from "../../infra/sticker/StickerDDBRepository";
import {StickerHistory} from "../../domain/sticker/model/StickerHistory";

export class StickerService {

    private static instance: StickerService;
    private stickerRepository: StickerRepository;

    private constructor() {
        this.stickerRepository = StickerDDBRepository.getInstance;
    }

    static get getInstance() {
        if (!StickerService.instance) {
            StickerService.instance = new StickerService();
        }
        return this.instance;
    }

    async addStickerHistory(stickerAddCommand: StickerAddCommand): Promise<StickerHistory> {
        const stickerHistory: StickerHistory = new StickerHistory(stickerAddCommand);
        return await this.stickerRepository.save(stickerHistory);
    }
}