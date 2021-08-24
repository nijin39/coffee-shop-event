import {APIGatewayProxyEvent} from "aws-lambda";
import {ProxyIntegrationEvent} from "aws-lambda-router/lib/proxyIntegration";

export class CustomerController {
    getCustomerInfo(customerId: string|undefined): string {
        console.log(customerId);
        return customerId ? customerId : "empty";
    }
}
