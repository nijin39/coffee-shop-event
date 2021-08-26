
class NotFoundBarcodeException extends Error {

    public static NOT_FOUND_BARCODE: string = "No customer found with that ID.";

    constructor(public message: string) {
        super(message);
        this.name = "NotFoundBarcodeException";
        this.stack = (<any> new Error()).stack;
    }
}

export default NotFoundBarcodeException;