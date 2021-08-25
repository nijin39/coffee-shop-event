import CreateBarcodeCommand from '../command/CreateBarcodeCommand';
import DeleteBarcodeCommand from '../command/DeleteBarcodeCommand';
import { Barcode } from '../model/Barcode';

export interface BarcodeRepository {
    deleteBarcode(deleteBarcodeCommand: DeleteBarcodeCommand): Promise<Barcode>
    createBarcode(createBarcodeCommand: CreateBarcodeCommand): Promise<Barcode>
    selectBarcodeInfo(customerId: string): Promise<Barcode>
}