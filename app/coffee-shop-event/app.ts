import * as router from 'aws-lambda-router'
import {Context} from "aws-lambda";
import {RouterEvent} from "aws-lambda-router";
import { BarcodeController } from "./ui/barcode/BarcodeController";
import { CustomerController } from './ui/customer/CustomerController';
import LambdaResponse from './util/LambdaResponse';
import { ProxyIntegrationEvent, ProxyIntegrationResult } from 'aws-lambda-router/lib/proxyIntegration';
import CreateCustomerCommand from './domain/customer/command/CreateCustomerCommand';

const customerController = CustomerController.getInstance;
const barcodeController = BarcodeController.getInstance;

export const lambdaHandler: <TContext extends Context>(event: RouterEvent, context: TContext) => Promise<any> = router.handler({
    proxyIntegration: {
        routes: [
            {
                path: '/frequency/{customerId}/barcode',
                method: 'POST',
                action: async (request, context) => {
                    return await barcodeController.createBarcode(  request.paths?.customerId ) as ProxyIntegrationResult;
                }
            },
            {
                path: '/frequency/{customerId}/barcode',
                method: 'GET',
                action: async (request, context) => {
                    const response:LambdaResponse = await barcodeController.getBarcodeInfo( request.paths?.customerId );
                    return response as ProxyIntegrationResult;
                }
            },
            {
                path: '/frequency/{customerId}/barcode',
                method: 'DELETE',
                action: async (request, context) => {
                    const response:LambdaResponse = await barcodeController.deleteBarcode( request.paths?.customerId );
                    return response as ProxyIntegrationResult;
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
                path: '/customer/{customerId}/gift',
                method: 'GET',
                action: async (request, context) => {
                    const response:LambdaResponse = await customerController.getGiftCount( request.paths?.customerId );
                    return response as ProxyIntegrationResult;
                }
            },
            {
                path: '/customer',
                method: 'POST',
                action: async (request, context) => {
                    const response:LambdaResponse = await customerController.createCustomerInfo( request as ProxyIntegrationEvent<CreateCustomerCommand> );
                    return response as ProxyIntegrationResult;
                }
            }
        ]
    }
})
