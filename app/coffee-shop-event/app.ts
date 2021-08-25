import * as router from 'aws-lambda-router'
import {Context} from "aws-lambda";
import {RouterEvent} from "aws-lambda-router";
import { BarcodeController } from "./ui/barcode/BarcodeController";
import { CustomerController } from './ui/customer/CustomerController';
import LambdaResponse from './util/LambdaResponse';
import { ProxyIntegrationResult } from 'aws-lambda-router/lib/proxyIntegration';

const customerController = CustomerController.getInstance;

export const lambdaHandler: <TContext extends Context>(event: RouterEvent, context: TContext) => Promise<any> = router.handler({
    proxyIntegration: {
        routes: [
            {
                path: '/frequency/{customerId}/barcode',
                method: 'POST',
                action: (request, context) => {
                    const barcontroller:BarcodeController = new BarcodeController();
                    return "You called me with: " + barcontroller.getBarcode(request);
                }
            },
            {
                path: '/frequency/{customerId}/barcode',
                method: 'GET',
                action: (request, context) => {
                    return "You called me with: " + request.paths?.userId;
                }
            },
            {
                path: '/frequency/{customerId}/barcode',
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
            },
            {
                path: '/customer/{customerId}',
                method: 'GET',
                action: async (request, context) => {
                    const response:LambdaResponse = await customerController.getCustomerInfo( request.paths?.customerId );
                    return response as ProxyIntegrationResult;
                }
            },
            {
                path: '/customer',
                method: 'POST',
                action: async (request, context) => {
                    const response:LambdaResponse = await customerController.createCustomerInfo( request );
                    return response as ProxyIntegrationResult;
                }
            }
        ]
    }
})
