import CreateCustomerCommand from "../../domain/customer/command/CreateCustomerCommand";
import {Customer} from "../../domain/customer/model/Customer";
import {CustomerRepository} from "../../domain/customer/service/CustomerRepository";
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

    async getCustomerInfo(customerId: string | undefined): Promise<Customer> {
        const customer: Customer = await this.customerRepository.selectCustomerInfo(customerId!);
        return customer;
    }

    async getGiftCount(customerId: string | undefined): Promise<number> {
        const customer: Customer = await this.customerRepository.selectCustomerInfo(customerId!);
        const foundCustomer = Object.assign(Customer, customer);
        return foundCustomer.giftSimulation();
    }

    async createCustomer(createCustomerCommand: CreateCustomerCommand): Promise<Customer> {
        const customer: Customer = new Customer(createCustomerCommand);
        return await this.customerRepository.save(customer);
    }
}