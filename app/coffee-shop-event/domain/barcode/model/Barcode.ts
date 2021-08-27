export class Barcode {
    customerId: string; //Partition key
    barcode: string;
    barcodeStatus: string|'valid'|'expired'

    constructor(customerId:string, barcode:string) {
        this.customerId = customerId;
        this.barcode = barcode;
        this.barcodeStatus = 'valid';
    }
}