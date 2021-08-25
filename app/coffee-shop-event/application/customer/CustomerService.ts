import { Customer } from "../../domain/customer/Customer";
import { CustomerRepository } from "../../domain/customer/CustomerRepository";
import CustomerDDBRepository from "../../infra/customer/CustomerDDBRepository";

export class CustomerService {

    private static instance: CustomerService;
    private customerRepository: CustomerRepository;

    private constructor() {
        this.customerRepository = CustomerDDBRepository.getInstance;
    }

    static get getInstance() {
        if (!CustomerService.instance) {
            CustomerService.instance = new CustomerService();
        }
        return this.instance;
    }

    async getCustomerInfo(customerId: string|undefined): Promise<Customer> {
        if( customerId === undefined) {
            return new Customer("Empty", "Empty");
        } else {
            const customer:Customer = await this.customerRepository.selectCustomerInfo(customerId);
            return customer;
        }
    }
}