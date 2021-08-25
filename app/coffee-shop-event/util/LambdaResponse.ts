import { Header } from "aws-sdk/clients/mediastore";

export default class LambdaResponse {
    statusCode: number;
    body: string;

    constructor(statusCode: number, header: string, body: string) {
        this.statusCode = statusCode;
        this.body = body;
    }
}