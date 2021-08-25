export default class DeleteBarcodeCommand {
    customerId: string;

    constructor(customerId:string) {
        this.customerId = customerId;
    }
}