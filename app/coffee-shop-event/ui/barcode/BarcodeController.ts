import { BarcodeService } from "../../application/barcode/CustomerService";
import CreateBarcodeCommand from "../../domain/barcode/command/CreateBarcodeCommand";
import LambdaResponse from "../../util/LambdaResponse";

export class BarcodeController {

    private static instance: BarcodeController;
    private barcodeService: BarcodeService;

    private constructor() {
        this.barcodeService = BarcodeService.getInstance;
    }

    static get getInstance() {
        if (!BarcodeController.instance) {
            BarcodeController.instance = new BarcodeController();
        }
        return this.instance;
      }

    async getBarcodeInfo(customerId: string | undefined): Promise<LambdaResponse> {
        const result = await this.barcodeService.getBarcodeInfo(customerId)
            .then(barcode => {
                return new LambdaResponse(200, "GetItem", JSON.stringify(barcode));
            }).catch(error => {
                console.log(error);
                return new LambdaResponse(500, "GetItem", JSON.stringify(error));
            });

        return result;
    }

    async createBarcode(customerId: string | undefined): Promise<LambdaResponse> {

        if( customerId !== undefined) {
            //TODO Exception
            console.log("Error");
        } 

        const result = await this.barcodeService.createBarcode(new CreateBarcodeCommand(customerId!))
        .then(customer => {
            return new LambdaResponse(200, "GetItem", JSON.stringify(customer));
        }).catch(error => {
            console.log(error);
            return new LambdaResponse(500, "GetItem", JSON.stringify(error));
        });

    return result;
    }
}
