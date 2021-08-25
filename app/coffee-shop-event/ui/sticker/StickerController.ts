import {CustomerService} from "../../application/customer/CustomerService";

export class StickerController {

    private static instance: StickerController;
    //private customerService: CustomerService;

    private constructor() {
        //this.customerService = CustomerService.getInstance;
    }

    static get getInstance() {
        if (!StickerController.instance) {
            StickerController.instance = new StickerController();
        }
        return this.instance;
    }

    addStickerHistory(message:string) {
        console.log( JSON.parse(message) );
    }

}