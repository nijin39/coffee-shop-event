No lines are selected.
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {DivisionController} from "./division/interface/division-controller";
import { LeagueScheduleController } from "./leagueSchedule/interface/leagueSchedule-controller";
import {LeagueController} from "./league/interface/league-controller";
import {StadiumController} from "./stadium/interface/stadium-controller";
import {ErrorCode, ExceptionError} from "./common/exceptionHandler";

// 참고 : https://omakoleg.github.io/typescript-practices/content/lambda.html
// todo : APIGatewayProxyEvent 에서 필요한 부분만 따로 pass ?
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return await RouteRule.create(event)
      .add(new LeagueScheduleController())
      .add(new DivisionController())
      .add(new LeagueController())
      .add(new StadiumController())
      .route();
};

export const GetMapping = (path: string) => "GET" + path
export const PostMapping = (path: string) => "POST" + path
export const PutMapping = (path: string) => "PUT" + path
export const DeleteMapping = (path: string) => "DELETE" + path

export type RequestHandlerType = (event: APIGatewayProxyEvent) => Promise<object>

export interface Controller {
    router(): Map<string, RequestHandlerType>;
}

class RouteRule {
    constructor(
        private readonly event: APIGatewayProxyEvent,
        private readonly routeMap: Map<string, RequestHandlerType> = new Map()
    ) {}
    static create(event: APIGatewayProxyEvent): RouteRule {
        return new RouteRule(event);
    }

    add(controller: Controller): RouteRule {
        controller.router().forEach(
            (value, key) => this.routeMap.set(key, value)
        );
        return this;
    }

    async route(): Promise<APIGatewayProxyResult> {
        const key = this.event.httpMethod + this.event.path;
        const handler: RequestHandlerType | undefined = this.routeMap.get(key);
        if (handler == null) {
            return Promise.resolve({
                statusCode: 500,
                headers: { "Content-Type": "text/plain" },
                body: `URL is not defined : ${this.event.path}`
            } as APIGatewayProxyResult);
        }
        try {
            const result = await handler(this.event);

            return Promise.resolve({
                statusCode: 200,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(result)
            } as APIGatewayProxyResult);

        } catch (e) {
            //정의된 에러는 바디에 메시지를 뱉는다.
            if(e instanceof ExceptionError) {
                return Promise.resolve({
                    statusCode: e.httpCode ?? ErrorCode.INTERNAL_SERVER_ERROR,
                    headers: { "Content-Type": "text/plain" },
                    body: `[${e.name}] ${e.message}`
                } as APIGatewayProxyResult);
            } else {
                //모르는 에러는 걍 뱉는다.
                return Promise.resolve({
                    statusCode: ErrorCode.INTERNAL_SERVER_ERROR,
                    headers: { "Content-Type": "text/plain" },
                    body: `Internal error occurred`
                } as APIGatewayProxyResult);
            }

        }
    }
}