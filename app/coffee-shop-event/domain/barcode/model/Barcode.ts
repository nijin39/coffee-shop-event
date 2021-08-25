export class Barcode {
    customerId: string; //Partition key
    barcode: string;

    constructor(customerId:string, barcode:string) {
        this.customerId = customerId;
        this.barcode = barcode;
    }
}