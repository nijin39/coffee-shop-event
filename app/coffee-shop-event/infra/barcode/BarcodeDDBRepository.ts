import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { v4 as uuidv4 } from 'uuid';
import { BarcodeRepository } from '../../domain/barcode/service/BarcodeRepository';
import CreateBarcodeCommand from '../../domain/barcode/command/CreateBarcodeCommand';
import { Barcode } from '../../domain/barcode/model/Barcode';

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
// const CouponTable = String(process.env.CouponTable)

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
            TableName: "CustomerTable",
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
            TableName: 'CustomerTable',
            Item: {
                customerId: createCustomerCommand.customerId,
                SK: 'barcode',
                barcode: barcode,
                timestamp: Date.now()
            }
        }

        const result = await dynamoDbClient.put(param).promise();
        
        return Promise.resolve({
            customerId: createCustomerCommand.customerId,
            barcode: barcode
        });
    }

    // async registeredCoupon(couponTargetInfo: CouponTarget, couponInfo: CouponInfo): Promise<CouponInfo> {
    //     const couponNo = uuid();
    //     const params = {
    //         TableName: CouponTable,
    //         Item: {
    //             PK: 'COUPON#' + couponNo,
    //             SK: 'COUPONINFO',
    //             registDate: moment().toISOString(),
    //             couponName: couponInfo.couponName,
    //             couponDescription: couponInfo.couponDescription,
    //             couponType: couponInfo.couponType,
    //             couponNo: couponNo,
    //             couponTarget: couponTargetInfo,
    //             couponStartDate: couponInfo.couponStartDate,
    //             couponEndDate: couponInfo.couponEndDate,
    //             couponYear: couponInfo.couponYear,
    //             couponSemester: couponInfo.couponSemester,
    //             price: couponInfo.price,
    //             minBaseValue: couponInfo.minBaseValue,
    //             maxBaseValue: couponInfo.maxBaseValue,
    //             status: "CREATED"
    //         }
    //     };

    //     const result = await dynamoDbClient.put(params).promise();
    //     return Promise.resolve(couponInfo);
    // }

    // async findUsedCouponList(memberNo: string): Promise<Array<Coupon>> {
    //     const params = {
    //         TableName: CouponTable,
    //         KeyConditionExpression: "#74f00 = :74f00",
    //         FilterExpression: "#74f01 = :74f01",
    //         ExpressionAttributeValues: {
    //             ":74f00": "MemberNo#jngkim",
    //             ":74f01": true
    //         },
    //         ExpressionAttributeNames: {
    //             "#74f00": "PK",
    //             "#74f01": "useCoupon"
    //         }
    //     }

    //     const result = await dynamoDbClient.query(params).promise();

    //     return result.Items as Coupon[];
    // }

    // async findAllCoupons(): Promise<Coupon[]> {
    //     const params = {
    //         TableName: CouponTable,
    //         IndexName: "GSI-1-PK",
    //         KeyConditionExpression: "#2ea90 = :2ea90",
    //         ExpressionAttributeValues: {
    //             ":2ea90": "COUPONINFO"
    //         },
    //         ExpressionAttributeNames: {
    //             "#2ea90": "SK"
    //         }
    //     }

    //     const result = await dynamoDbClient.query(params).promise();
    //     return result.Items as Coupon[];
    // }

    // async findValidCouponList(memberNo: string): Promise<Coupon[]> {

    //     const today = new Date().getFullYear().toString()+(new Date().getMonth()+1).toString().padStart(2,"0")+new Date().getDate().toString().padStart(2,"0");

    //     const params = {
    //         TableName: CouponTable,
    //         IndexName: "GSI-1-PK",
    //         KeyConditionExpression: "#2ea90 = :2ea90",
    //         FilterExpression: "#2ea91 = :2ea91 and #2ea92 <= :2ea92 ",
    //         ExpressionAttributeValues: {
    //             ":2ea90": "COUPONINFO",
    //             ":2ea91": "ACTIVE",
    //             ":2ea92" : today,
    //             // ":2ea93" : today
    //         },
    //         ExpressionAttributeNames: {
    //             "#2ea90": "SK",
    //             "#2ea91": "status",
    //             "#2ea92" : "couponStartDate",
    //             // "#2ea93" : "couponEndDate"
    //         }
    //     }

    //     const result = await dynamoDbClient.query(params).promise();

    //     return result.Items as Coupon[];
    // }

    // returnedCoupon(couponId: string): Promise<boolean> {
    //     return Promise.resolve(false);
    // }

    // async findCouponById(couponId: string): Promise<Coupon> {

    //     const params = {
    //         TableName: CouponTable,
    //         KeyConditionExpression: "#cd420 = :cd420 And #cd421 = :cd421",
    //         ExpressionAttributeValues: {
    //             ":cd420": "COUPON#"+couponId,
    //             ":cd421": "COUPONINFO"
    //         },
    //         ExpressionAttributeNames: {
    //             "#cd420": "PK",
    //             "#cd421": "SK"
    //         }
    //     }

    //     const result = await dynamoDbClient.query(params).promise();

    //     const results = result.Items as Coupon[];
    //     return results[0];
    // }

    // async save(coupon: Coupon) {
    //     const params = {
    //         TableName: CouponTable,
    //         Item: coupon
    //     };

    //     const result = await dynamoDbClient.put(params).promise();
    //     return result;
    // }
}

export default BarcodeDDBRepository;