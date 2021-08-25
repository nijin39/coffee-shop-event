import { Customer } from '../model/Customer';

export interface CustomerRepository {
    selectCustomerInfo(customerId: string): Promise<Customer>
}