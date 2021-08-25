import CreateBarcodeCommand from "../../domain/barcode/command/CreateBarcodeCommand";
import { Barcode } from "../../domain/barcode/model/Barcode";
import { BarcodeRepository } from "../../domain/barcode/service/BarcodeRepository";
import BarcodeDDBRepository from "../../infra/barcode/BarcodeDDBRepository";

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
            return new Barcode("Empty", "Empty");
        } else {
            const barcode:Barcode = await this.barcodeRepository.selectBarcodeInfo(customerId);
            return barcode;
        }
    }

    async createBarcode(createBarcodeCommand: CreateBarcodeCommand): Promise<Barcode> {
        const barcode:Barcode = await this.barcodeRepository.createBarcode(createBarcodeCommand);
        return barcode;
    }
}