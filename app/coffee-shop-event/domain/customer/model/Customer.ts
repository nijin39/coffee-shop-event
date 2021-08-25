export class Customer {
    customerId: string; //Partition key
    nickName: string;

    constructor(customerId:string, nickName:string) {
        this.customerId = customerId;
        this.nickName = nickName;
    }
}