import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { Customer } from '../../domain/customer/model/Customer';
import { CustomerRepository } from '../../domain/customer/service/CustomerRepository';
import {StickerRepository} from "../../domain/sticker/service/StickerRepository";
import {StickerHistory} from "../../domain/sticker/model/StickerHistory";

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
const stickerHistoryTable = String(process.env.STICKER_HISTORY_TABLE)

class StickerDDBRepository implements StickerRepository {
    private static instance: StickerDDBRepository;

    private constructor() {
        StickerDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!StickerDDBRepository.instance) {
            StickerDDBRepository.instance = new StickerDDBRepository();
        }
        return this.instance;
    }

    async save(stickerHistory: StickerHistory): Promise<StickerHistory> {
        const param = {
            TableName: stickerHistoryTable,
            Item: {
                customerId: stickerHistory.customerId,
                SK: 'STICKERHISTORY#'+stickerHistory.orderTimestamp,
                orderType:stickerHistory.orderType,
                productionType:stickerHistory.productionType
            }
        }
        const result = await dynamoDbClient.put(param).promise();
        return stickerHistory;
    }
}

export default StickerDDBRepository;