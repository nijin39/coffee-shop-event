import { StickerHistory } from "../model/StickerHistory";

export interface StickerRepository {
    save(stickerHistory: StickerHistory): Promise<StickerHistory>;
}