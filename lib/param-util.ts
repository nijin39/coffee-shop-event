import { Construct, CfnOutput } from "@aws-cdk/core";
import * as ssm from '@aws-cdk/aws-ssm';

export class ParameterUtil {
    public static putParamAndCfnOutput(scope:Construct, branch:string, paramterId:string, paramKey:string, outputKey:string, value:string) {
        if (paramKey && outputKey && value){
            new ssm.StringParameter(scope, paramterId, {
                allowedPattern: '.*',
                description: paramterId + ' for ' + branch,
                parameterName: paramKey + branch,
                stringValue: value,
                tier: ssm.ParameterTier.ADVANCED,
            });
                
            // Prints out the AppSync GraphQL API URL to the ternminal
            if(!outputKey) {
                new CfnOutput(scope, outputKey, {
                    value: value
                });
            }
        }
        else 
            throw 'Failed to build SSM Paramter'
    }

    public static getParameter(scope:Construct, param:string, alternativeParam:string) :string {
        let paramValue:string = '';

        try{
            //ApiGatewayEndpoint = ssm.StringParameter.valueFromLookup(this, '/enrollment/' + props.ParamPath + '/apigw');
            paramValue = ssm.StringParameter.valueForStringParameter(scope, param);
        }
        catch(e){
            paramValue = alternativeParam;
        }

        return paramValue;
    }
}