import {CfnDeletionPolicy, Construct, Duration, Stack} from "@aws-cdk/core";
import {BranchCode, MyStackProps} from './stack-types';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import {CfnTable, StreamViewType} from "@aws-cdk/aws-dynamodb";
import * as iam from '@aws-cdk/aws-iam';

export class CdkBackendStack extends Stack {

  constructor(scope: Construct, id: string, props?: MyStackProps) {

    super(scope, id, props);

    if(props && props.UserBranch) {
      try {
        const router = new lambda.Function(this, 'RouteHandler', {
          runtime: lambda.Runtime.NODEJS_10_X,
          code: lambda.Code.fromAsset('lambda'),
          handler: 'router.lambdaHandler',
          timeout: Duration.minutes(1)
        });
        new apigw.LambdaRestApi(this, 'Endpoint-' + props.UserBranch, {
          handler: router
        });

        //리그디비전 테이블 만들기 및 스트림 생성하기
        let divisionTable = new dynamodb.Table(this, 'LeagueDivision', {
            partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
            stream: StreamViewType.NEW_AND_OLD_IMAGES
        });
        //라우터에게 내 테이블 이름 알려주기
        router.addEnvironment("LEAGUE_DIVISION_TABLE_NAME", divisionTable.tableName);
        //람다가 파라미터 스토어에서 값을 읽어올 수 있도록 권한 설정
        router.role?.addToPolicy( new iam.PolicyStatement({
              actions: [ 'ssm:GetParameters', 'ssm:GetParameter' ],
              resources: ['*']
            })
        );
        //내 테이블 라우터 람다에게 RW권한주기
        divisionTable.grantReadWriteData(router);

        if(props.UserBranch !== BranchCode.Master && props.UserBranch !== BranchCode.Development ) {
          let ddbOpt = divisionTable.node.defaultChild as CfnTable;
          ddbOpt.cfnOptions.deletionPolicy = CfnDeletionPolicy.DELETE;
        }

      } catch (error) {
        throw error;
      } finally {
        
      }

    }
  }
}