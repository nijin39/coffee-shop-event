

export class Promotion {

    promotionId: string; //Partition key
    searchType: string;
    startDt: string;
    endDt: string;
    expiredYn: boolean;

    constructor(promotionId:string, searchType:string, startDt:string, endDt:string, expiredYn: boolean) {
        this.promotionId = promotionId;
        this.searchType = searchType;
        this.startDt = startDt;
        this.endDt = endDt;
        this.expiredYn = expiredYn;
    }
}