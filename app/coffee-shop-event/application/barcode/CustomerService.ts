import CreateBarcodeCommand from "../../domain/barcode/command/CreateBarcodeCommand";
import DeleteBarcodeCommand from "../../domain/barcode/command/DeleteBarcodeCommand";
import { Barcode } from "../../domain/barcode/model/Barcode";
import { BarcodeRepository } from "../../domain/barcode/service/BarcodeRepository";
import BarcodeDDBRepository from "../../infra/barcode/BarcodeDDBRepository";
import NotFoundCustomerException from "../../exceptions/NotFoundCustomerException";
import NotFoundBarcodeException from "../../exceptions/NotFoundBarcodeException";

export class BarcodeService {
    private static instance: BarcodeService;
    private barcodeRepository: BarcodeRepository;

    private constructor() {
        this.barcodeRepository = BarcodeDDBRepository.getInstance;
    }

    static get getInstance() {
        if (!BarcodeService.instance) {
            BarcodeService.instance = new BarcodeService();
        }
        return this.instance;
    }

    async getBarcodeInfo(customerId: string|undefined): Promise<Barcode> {
        if( customerId === undefined) {
            throw new NotFoundCustomerException(NotFoundCustomerException.NOT_FOUND_CUSTOMER);
        } else {
            const barcode:Barcode = await this.barcodeRepository.selectBarcodeInfo(customerId);
            if( barcode === undefined ) {
                throw new NotFoundBarcodeException(NotFoundBarcodeException.NOT_FOUND_BARCODE);
            }
            return barcode;
        }
    }

    async createBarcode(createBarcodeCommand: CreateBarcodeCommand): Promise<Barcode> {
        const barcode:Barcode = await this.barcodeRepository.createBarcode(createBarcodeCommand);
        return barcode;
    }

    async deleteBarcode(deleteBarcodeCommand: DeleteBarcodeCommand) {
        const barcode:Barcode = await this.barcodeRepository.deleteBarcode(deleteBarcodeCommand);
        return barcode;
    }
}