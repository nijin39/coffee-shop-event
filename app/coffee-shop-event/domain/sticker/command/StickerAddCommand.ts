export interface StickerAddCommand {
    customerId:string;
    orderType:string|'add'|'cancel';
    productionType:string|'mission'|'normal';
    timestamp:string;
}