import { Construct, Duration, Stack } from "@aws-cdk/core";
import { MyStackProps } from './stack-types';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from "path";
import {LambdaRestApi} from "@aws-cdk/aws-apigateway";
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as sqs from '@aws-cdk/aws-sqs';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';

export class CdkBackendStack extends Stack {

  constructor(scope: Construct, id: string, props?: MyStackProps) {

    super(scope, id, props);

    if(props && props.UserBranch) {
      try {
        // Lambda Function
        const lambdaFunction = new lambda.Function(this, 'RouteHandler', {
          runtime: lambda.Runtime.NODEJS_12_X,
          handler: 'app/coffee-shop-event/app.lambdaHandler',
          code: lambda.Code.fromAsset(path.join("../app/coffee-shop-event/")),
        });

        const RestAPI = new LambdaRestApi(this, 'CoffeeEventAPIS', {
          handler: lambdaFunction
        });

        const customerTable = new dynamodb.Table(this, 'CustomerTable', {
          tableName: 'CustomerTable-' + props.UserBranch,
          partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
          sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING }
        });

        lambdaFunction.addEnvironment('CUSTOMER_TABLE', customerTable.tableName);

        const orderLambdaFunction = new lambda.Function(this, 'OrderHandler', {
          runtime: lambda.Runtime.NODEJS_12_X,
          handler: 'app/coffee-shop-event/orderQueue.handler',
          code: lambda.Code.fromAsset(path.join("../app/coffee-shop-event/")),
        });

        const queue = new sqs.Queue(this, 'OrderQueue', {
          visibilityTimeout: Duration.seconds(30),    // default,
          receiveMessageWaitTime: Duration.seconds(20) // default
        });

        orderLambdaFunction.addEventSource(new SqsEventSource(queue, {
          batchSize: 10, // default
          maxBatchingWindow: Duration.minutes(5),
        }));

        orderLambdaFunction.addEnvironment('ORDER_QUEUE', queue.queueArn);
        customerTable.grantReadWriteData(lambdaFunction);

      } catch (error) {
        throw error;
      } finally {
        console.log("Finish CDK");
      }

    }
  }
}