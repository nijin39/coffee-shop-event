import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { Customer } from '../../domain/customer/model/Customer';
import { CustomerRepository } from '../../domain/customer/service/CustomerRepository';

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
const CustomerTable = String(process.env.CUSTOMER_TABLE)

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
            TableName: CustomerTable,
            Key: {
                customerId: customerId,
                SK: 'SUMMARY#'+customerId,
            }
        }
        const result = await dynamoDbClient.get(param).promise();
        return result.Item as Customer;
    }

    async save(customer: Customer): Promise<Customer> {
        const param = {
            TableName: CustomerTable,
            Item: {
                customerId: customer.customerId,
                nickName: customer.nickName,
                SK: 'SUMMARY#'+customer.customerId,
                missionProductCount: customer.missionProductCount,
                normalProductCount: customer.normalProductCount
            }
        }
        const result = await dynamoDbClient.put(param).promise();
        return customer;
    }
}

export default CouponDDBRepository;