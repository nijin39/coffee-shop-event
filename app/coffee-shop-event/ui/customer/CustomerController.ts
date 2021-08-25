import { APIGatewayProxyEvent } from "aws-lambda";
import { ProxyIntegrationEvent } from "aws-lambda-router/lib/proxyIntegration";
import { CustomerService } from "../../application/customer/CustomerService";
import LambdaResponse from "../../util/LambdaResponse";

export class CustomerController {

    private static instance: CustomerController;
    private customerService: CustomerService;

    private constructor() {
        this.customerService = CustomerService.getInstance;
    }

    static get getInstance() {
        if (!CustomerController.instance) {
            CustomerController.instance = new CustomerController();
        }
        return this.instance;
      }

    getCustomerInfo(customerId: string | undefined): string {
        this.customerService.getCustomerInfo(customerId)
            .then(customer => {
                return new LambdaResponse(200, "GetItem", JSON.stringify(customer));
            }).catch(error => {
                console.log(error);
                return new LambdaResponse(500, "GetItem", JSON.stringify(error));
            });

        return customerId ? customerId : "empty";
    }
}
