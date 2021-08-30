import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config'

import CreateBarcodeCommand from '../../domain/barcode/command/CreateBarcodeCommand';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { BarcodeRepository } from '../../domain/barcode/service/BarcodeRepository';
import { Barcode } from '../../domain/barcode/model/Barcode';
import DeleteBarcodeCommand from '../../domain/barcode/command/DeleteBarcodeCommand';

const serviceLocalConfigOptions: ServiceConfigurationOptions = {
    region: 'ap-northeast-2',
    endpoint: 'http://dynamodb-local:8000',
    accessKeyId: String(process.env.LOCAL_DYNAMODB_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.LOCAL_DYNAMODB_SECRET_ACESS_KEY)
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

class BarcodeDDBRepository implements BarcodeRepository {
    private static instance: BarcodeDDBRepository;

    private constructor() {
        BarcodeDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!BarcodeDDBRepository.instance) {
            BarcodeDDBRepository.instance = new BarcodeDDBRepository();
        }
        return this.instance;
    }

    async selectBarcodeInfo(customerId: string): Promise<Barcode> {
        const param = {
            TableName: CustomerTable,
            Key: {
                customerId: customerId,
                SK: 'barcode'
            }
        }

        const result = await dynamoDbClient.get(param).promise();
        return result.Item as Barcode;
    }

    async createBarcode(createCustomerCommand: CreateBarcodeCommand): Promise<Barcode> {

        const barcode:string = uuidv4();

        const param = {
            TableName: CustomerTable,
            Item: {
                customerId: createCustomerCommand.customerId,
                SK: 'barcode',
                barcode: barcode,
                barcodeStatue: 'valid',
                timestamp: Date.now()
            }
        }

        const result = await dynamoDbClient.put(param).promise();
        
        return Promise.resolve({
            customerId: createCustomerCommand.customerId,
            barcode: barcode,
            barcodeStatus: 'valid'
        });
    }

    async deleteBarcode(deleteBarcodeCommand: DeleteBarcodeCommand): Promise<Barcode> {

        const barcode:Barcode = await this.selectBarcodeInfo(deleteBarcodeCommand.customerId);

        const param = {
            TableName: CustomerTable,
            Key: {
                customerId: deleteBarcodeCommand.customerId,
                SK: 'barcode'
            }
        }

        const result = await dynamoDbClient.delete(param).promise();
        return barcode;
    }

    save(barcode: Barcode): Promise<Barcode> {
        return Promise.resolve(barcode);
    }
}

export default BarcodeDDBRepository;