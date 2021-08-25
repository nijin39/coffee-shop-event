import { Customer } from '../model/Customer';
import {StickerAddCommand} from "../../sticker/command/StickerAddCommand";

export interface CustomerSummaryUpdater {
    addSummary(stickerAddCommand: StickerAddCommand): any;
    subSummary(stickerAddCommand: StickerAddCommand): any;
}