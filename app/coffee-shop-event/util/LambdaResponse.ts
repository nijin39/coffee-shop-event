import { Header } from "aws-sdk/clients/mediastore";

export default class LambdaResponse {
    private statusCode: number;
    private headers: string;
    private body: string;

    constructor(statusCode: number, header: string, body: string) {
        this.statusCode = statusCode;
        this.headers = JSON.stringify({ "x-customer-header": header});
        this.body = body;
    }
}