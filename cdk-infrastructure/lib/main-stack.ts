import { Construct, Duration, Stack } from "@aws-cdk/core";
import { MyStackProps } from './stack-types';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';

export class CdkBackendStack extends Stack {

  constructor(scope: Construct, id: string, props?: MyStackProps) {

    super(scope, id, props);

    if(props && props.UserBranch) {
      try {
        const router = new lambda.Function(this, 'RouteHandler', {
          runtime: lambda.Runtime.NODEJS_12_X,
          code: lambda.Code.fromAsset('lambda'),
          handler: 'app.lambdaHandler',
          timeout: Duration.minutes(1)
        });
        new apigw.LambdaRestApi(this, 'Endpoint-' + props.UserBranch, {
          handler: router
        });
      } catch (error) {
        throw error;
      } finally {
        console.log("Finish CDK");
      }

    }
  }
}