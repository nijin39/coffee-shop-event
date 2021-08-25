import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import CreateCustomerCommand from '../../domain/customer/command/CreateCustomerCommand';
import { Customer } from '../../domain/customer/model/Customer';
import { CustomerRepository } from '../../domain/customer/service/CustomerRepository';
import { v4 as uuidv4 } from 'uuid';

const serviceLocalConfigOptions: ServiceConfigurationOptions = {
    region: 'ap-northeast-2',
    endpoint: 'http://dynamodb-local:8000',
    accessKeyId: 'q1wgd',
    secretAccessKey: 'jzya5'
};

const serviceConfigOptions: ServiceConfigurationOptions = {
    region: 'ap-northeast-2',
};

if (process.env.AWS_SAM_LOCAL) {
    AWS.config.update(serviceLocalConfigOptions);
} else {
    AWS.config.update(serviceConfigOptions);
}

const dynamoDbClient = new AWS.DynamoDB.DocumentClient()
const CouponTable = String(process.env.CouponTable)

class CouponDDBRepository implements CustomerRepository {
    private static instance: CouponDDBRepository;

    private constructor() {
        CouponDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!CouponDDBRepository.instance) {
            CouponDDBRepository.instance = new CouponDDBRepository();
        }
        return this.instance;
    }

    async selectCustomerInfo(customerId: string): Promise<Customer> {
        const param: any = {
            TableName: "CustomerTable",
            Key: {
                customerId: customerId,
                SK: 'nickName'
            }
        }

        const result = await dynamoDbClient.get(param).promise();
        return result.Item as Customer;
    }

    async createCustomer(createCustomerCommand: CreateCustomerCommand): Promise<Customer> {
        const customerId = uuidv4();
        const param = {
            TableName: 'CustomerTable',
            Item: {
                customerId: customerId,
                SK: 'nickName',
                nickName: createCustomerCommand.nickName,
                timestamp: Date.now()
            }
        }

        const result = await dynamoDbClient.put(param).promise();
        
        return Promise.resolve({
            customerId: customerId,
            nickName: createCustomerCommand.nickName
        });
    }
}

export default CouponDDBRepository;