import { Customer } from './Customer';

export interface CustomerRepository {
    selectCustomerInfo(customerId: string): Promise<Customer>
}