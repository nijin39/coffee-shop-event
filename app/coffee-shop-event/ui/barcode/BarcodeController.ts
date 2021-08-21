import {APIGatewayProxyEvent} from "aws-lambda";
import {ProxyIntegrationEvent} from "aws-lambda-router/lib/proxyIntegration";

export class BarcodeController {
    getBarcode(event: ProxyIntegrationEvent): string {
        console.info("DivisionController.listDivisionMenus")
        return "abc";
    }
}
