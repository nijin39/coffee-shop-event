import CreateCustomerCommand from '../command/CreateCustomerCommand';
import { Customer } from '../model/Customer';

export interface CustomerRepository {
    //createCustomer(createCustomerCommand: CreateCustomerCommand): Promise<Customer>
    selectCustomerInfo(customerId: string): Promise<Customer>
    save(customer: Customer): Promise<Customer>;
}