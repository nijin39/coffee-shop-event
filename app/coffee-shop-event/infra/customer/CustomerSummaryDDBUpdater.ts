import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { Customer } from '../../domain/customer/model/Customer';
import { CustomerRepository } from '../../domain/customer/service/CustomerRepository';
import {CustomerSummaryUpdater} from "../../domain/customer/service/CustomSummaryUpdater";
import {StickerAddCommand} from "../../domain/sticker/command/StickerAddCommand";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import UpdateItemInput = DocumentClient.UpdateItemInput;

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

class CustomerSummaryDDBUpdater implements CustomerSummaryUpdater {
    private static instance: CustomerSummaryDDBUpdater;

    private constructor() {
        CustomerSummaryDDBUpdater.instance = this;
    }

    static get getInstance() {
        if (!CustomerSummaryDDBUpdater.instance) {
            CustomerSummaryDDBUpdater.instance = new CustomerSummaryDDBUpdater();
        }
        return this.instance;
    }

    addSummary(stickerAddCommand: StickerAddCommand) {
        let param:UpdateItemInput;

        if( stickerAddCommand.productionType === "mission"){
            param = {
                TableName: CustomerTable,
                Key: {
                    customerId: stickerAddCommand.customerId,
                    SK: 'SUMMARY#'+stickerAddCommand.customerId,
                },
                UpdateExpression: "set missionProductCount = missionProductCount + :val",
                ExpressionAttributeValues:{
                    ":val": 1
                },
                ReturnValues:"UPDATED_NEW"
            };
        } else {
            param = {
                TableName: CustomerTable,
                Key: {
                    customerId: stickerAddCommand.customerId,
                    SK: 'SUMMARY#'+stickerAddCommand.customerId,
                },
                UpdateExpression: "set normalProductCount = normalProductCount + :val",
                ExpressionAttributeValues:{
                    ":val": 1
                },
                ReturnValues:"UPDATED_NEW"
            };
        }

        return dynamoDbClient.update(param).promise();
    }

    subSummary(stickerAddCommand: StickerAddCommand) {
        let param:UpdateItemInput;

        if( stickerAddCommand.productionType === "mission"){
            param = {
                TableName: CustomerTable,
                Key: {
                    customerId: stickerAddCommand.customerId,
                    SK: 'SUMMARY#'+stickerAddCommand.customerId,
                },
                UpdateExpression: "set missionProductCount = missionProductCount - :val",
                ExpressionAttributeValues:{
                    ":val": 1
                },
                ReturnValues:"UPDATED_NEW"
            };
        } else {
            param = {
                TableName: CustomerTable,
                Key: {
                    customerId: stickerAddCommand.customerId,
                    SK: 'SUMMARY#'+stickerAddCommand.customerId,
                },
                UpdateExpression: "set normalProductCount = normalProductCount - :val",
                ExpressionAttributeValues:{
                    ":val": 1
                },
                ReturnValues:"UPDATED_NEW"
            };
        }

        return dynamoDbClient.update(param).promise();
    }

}

export default CustomerSummaryDDBUpdater;