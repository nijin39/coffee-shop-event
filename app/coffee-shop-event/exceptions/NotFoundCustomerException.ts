
class NotFoundCustomerException extends Error {

    public static NOT_FOUND_CUSTOMER: string = "No customer found with that ID.";

    constructor(public message: string) {
        super(message);
        this.name = "NotFoundCustomer";
        this.stack = (<any> new Error()).stack;
    }
}

export default NotFoundCustomerException;