import { Construct, Duration, Stack } from "@aws-cdk/core";
import { MyStackProps } from './stack-types';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";
import {LambdaRestApi} from "@aws-cdk/aws-apigateway";

export class CdkBackendStack extends Stack {

  constructor(scope: Construct, id: string, props?: MyStackProps) {

    super(scope, id, props);

    if(props && props.UserBranch) {
      try {
        const lambdaFunction = new NodejsFunction(this, 'RouteHandler', {
          runtime: lambda.Runtime.NODEJS_12_X,
          handler: 'lambdaHandler',
          entry: path.join(__dirname, `/../src/coffee-shop-event/app.ts`),
          timeout: Duration.minutes(1),
          bundling: {
            minify: true,
            externalModules: ['aws-sdk'],
          }
        });

        const RestAPI = new LambdaRestApi(this, 'FrontAPI', {
          handler: lambdaFunction
        });

      } catch (error) {
        throw error;
      } finally {
        console.log("Finish CDK");
      }

    }
  }
}