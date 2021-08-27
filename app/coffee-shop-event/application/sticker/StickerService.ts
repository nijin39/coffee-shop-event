import {StickerAddCommand} from "../../domain/sticker/command/StickerAddCommand";
import {StickerRepository} from "../../domain/sticker/service/StickerRepository";
import StickerDDBRepository from "../../infra/sticker/StickerDDBRepository";
import {StickerHistory} from "../../domain/sticker/model/StickerHistory";
import CustomerDDBRepository from "../../infra/customer/CustomerDDBRepository";
import { CustomerSummaryUpdater } from "../../domain/customer/service/CustomSummaryUpdater";
import CustomerSummaryDDBUpdater from "../../infra/customer/CustomerSummaryDDBUpdater";
import {StickerPresentCommand} from "../../domain/sticker/command/StickerPresentCommand";

export class StickerService {

    private static instance: StickerService;
    private stickerRepository: StickerRepository;
    private customerSummaryUpdater: CustomerSummaryUpdater;

    private constructor() {
        this.stickerRepository = StickerDDBRepository.getInstance;
        this.customerSummaryUpdater = CustomerSummaryDDBUpdater.getInstance;
    }

    static get getInstance() {
        if (!StickerService.instance) {
            StickerService.instance = new StickerService();
        }
        return this.instance;
    }

    async addStickerHistory(stickerAddCommand: StickerAddCommand): Promise<StickerHistory> {
        const stickerHistory: StickerHistory = new StickerHistory(stickerAddCommand);
        try {
            const savedStickerHistory:StickerHistory = await this.stickerRepository.save(stickerHistory);
            //TODO Sticker Delete
            if( stickerAddCommand.orderType === "add") {
                await this.customerSummaryUpdater.addSummary(stickerAddCommand);
            } else {
                await this.customerSummaryUpdater.subSummary(stickerAddCommand);
            }
        } catch (error) {
            console.error("Error Sticker Service :", error);
        } finally {
            return stickerHistory;
        }

    }

    // async stickerPresent(stickerPresentCommand: StickerPresentCommand):Promise<StickerHistory> {
    //     // 01. substract summary
    //     // 02. add summary
    //     // 03. history recode
    //     return new StickerHistory();
    // }
}