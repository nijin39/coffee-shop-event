import CreateCustomerCommand from "../command/CreateCustomerCommand";
import { v4 as uuidv4 } from 'uuid';

export class Customer {
    customerId: string; //Partition key
    nickName: string;
    missionProductCount: number;
    normalProductCount: number;

    constructor(createCustomerCommand: CreateCustomerCommand) {
        this.customerId = uuidv4();
        this.nickName = createCustomerCommand.nickName;
        this.missionProductCount = 0;
        this.normalProductCount = 0;
    }

    addMissionProductCount() {
        this.missionProductCount = this.missionProductCount + 1;
    }

    addNormalProductCount() {
        this.normalProductCount = this.normalProductCount + 1;
    }
}