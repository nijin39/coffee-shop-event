import { Construct, Duration, Stack } from "@aws-cdk/core";
import { MyStackProps } from './stack-types';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from "path";
import {LambdaRestApi} from "@aws-cdk/aws-apigateway";
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class CdkBackendStack extends Stack {

  constructor(scope: Construct, id: string, props?: MyStackProps) {

    super(scope, id, props);

    if(props && props.UserBranch) {
      try {
        const lambdaFunction = new lambda.Function(this, 'RouteHandler', {
          runtime: lambda.Runtime.NODEJS_12_X,
          handler: 'app/coffee-shop-event/app.lambdaHandler',
          code: lambda.Code.fromAsset(path.join("../app/coffee-shop-event/")),
        });

        const RestAPI = new LambdaRestApi(this, 'CoffeeEventAPIS', {
          handler: lambdaFunction
        });

        const customerTable = new dynamodb.Table(this, 'CustomerTable', {
          tableName: 'CustomerTable',
          partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING }
        });

        customerTable.grant(lambdaFunction,
           'dynamodb:GetItem',
           'dynamodb:PutItem');

      } catch (error) {
        throw error;
      } finally {
        console.log("Finish CDK");
      }

    }
  }
}