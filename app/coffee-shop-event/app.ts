import * as router from 'aws-lambda-router'
import {Context} from "aws-lambda";
import {RouterEvent} from "aws-lambda-router";
import { BarcodeController } from "./ui/barcode/BarcodeController";
export const lambdaHandler: <TContext extends Context>(event: RouterEvent, context: TContext) => Promise<any> = router.handler({
    proxyIntegration: {
        routes: [
            {
                path: '/frequency/{userId}/barcode',
                method: 'POST',
                action: (request, context) => {
                    const barcontroller:BarcodeController = new BarcodeController();
                    return "You called me with: " + barcontroller.getBarcode(request);
                }
            },
            {
                path: '/frequency/{userId}/barcode',
                method: 'GET',
                action: (request, context) => {
                    return "You called me with: " + request.paths?.userId;
                }
            },
            {
                path: '/frequency/{userId}/barcode',
                method: 'DELETE',
                action: (request, context) => {
                    return "You called me with: " + request.paths?.userId;
                }
            },
            {
                path: '/frequency/barcode/validation',
                method: 'GET',
                action: (request, context) => {
                    return "You called me with: " + request;
                }
            }
        ]
    }
})
