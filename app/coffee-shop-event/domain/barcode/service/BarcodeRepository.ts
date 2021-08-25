import CreateBarcodeCommand from '../command/CreateBarcodeCommand';
import { Barcode } from '../model/Barcode';

export interface BarcodeRepository {
    createBarcode(createBarcodeCommand: CreateBarcodeCommand): Promise<Barcode>
    selectBarcodeInfo(customerId: string): Promise<Barcode>
}