import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const accountId = cdk.Stack.of(this).account;
    const region = cdk.Stack.of(this).region;

    const s3Policy: cdk.aws_iam.PolicyStatement = this.creatrePolicyS3Using();

    // GET/POSTなどメソッド別に関連付ける方法
    const funcGetFile = this.createLambda(this, "GetFile", "src/getFile.ts", "handler", s3Policy);
    const funcPostFile = this.createLambda(this, "PostFile", "src/postFile.ts", "handler", s3Policy);

    const api = new apigw.RestApi(this, "NormalApi");
    const apiFiles = api.root.addResource("files", {});
    const apiFileName = apiFiles.addResource("{name}");
    apiFileName.addMethod("GET", new apigw.LambdaIntegration(funcGetFile));
    apiFileName.addMethod("POST", new apigw.LambdaIntegration(funcPostFile));
  }

  createLambda(
    scope: Construct,
    id: string,
    entryPath: string,
    handlerName: string,
    policy: cdk.aws_iam.PolicyStatement
  ): cdk.aws_lambda_nodejs.NodejsFunction {
    const func = new cdk.aws_lambda_nodejs.NodejsFunction(scope, id, {
      entry: entryPath,
      handler: handlerName, // デフォルトのハンドラ関数名は "handler"
      runtime: lambda.Runtime.NODEJS_18_X, // デフォルトは Node.js 14.x
      timeout: cdk.Duration.minutes(15), // デフォルトは 3 秒
    });
    func.addToRolePolicy(policy);
    return func;
  }
  creatrePolicyS3Using(): cdk.aws_iam.PolicyStatement {
    return new cdk.aws_iam.PolicyStatement({
      actions: [`*`],
      effect: cdk.aws_iam.Effect.ALLOW,
      resources: [`*`],
    });
  }
}
