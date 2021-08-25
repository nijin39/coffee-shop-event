import { ProxyIntegrationEvent } from "aws-lambda-router/lib/proxyIntegration";
import { CustomerService } from "../../application/customer/CustomerService";
import CreateCustomerCommand from "../../domain/customer/command/CreateCustomerCommand";
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

    async getCustomerInfo(customerId: string | undefined): Promise<LambdaResponse> {
        const result = await this.customerService.getCustomerInfo(customerId)
            .then(customer => {
                return new LambdaResponse(200, "GetItem", JSON.stringify(customer));
            }).catch(error => {
                console.log(error);
                return new LambdaResponse(500, "GetItem", JSON.stringify(error));
            });

        return result;
    }

    async createCustomerInfo(request: ProxyIntegrationEvent<CreateCustomerCommand>): Promise<LambdaResponse> {
        const createCustomerCommand:CreateCustomerCommand = request.body;
        const result = await this.customerService.createCustomer(createCustomerCommand)
        .then(customer => {
            return new LambdaResponse(200, "GetItem", JSON.stringify(customer));
        }).catch(error => {
            console.log(error);
            return new LambdaResponse(500, "GetItem", JSON.stringify(error));
        });

    return result;
    }

}