import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3, aws_lambda as lambda, aws_dynamodb as dynamodb, aws_apigateway as apigateway, CfnOutput, aws_iam as iam } from 'aws-cdk-lib';

export class CodingChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = this.createS3Bucket('MyBucket');
    const table = this.createDynamoDBTable('FileTable');
    const lambdaFunction = this.createLambdaFunction('MyLambdaFunction', bucket, table, 'lambda.zip', 'index.handler');
    const api = this.createApiGateway(lambdaFunction, 'API');

    // Outputs
    new CfnOutput(this, 'BucketURL', {
      value: `https://${bucket.bucketName}.s3.${cdk.Aws.REGION}.amazonaws.com`,
      description: 'The REST API endpoint of the S3 bucket',
    });

    new CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'The name of the S3 bucket',
    });

    new CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'The endpoint URL of the API Gateway',
    });
  }

  private createS3Bucket(bucketName: string): s3.Bucket {
    const bucket = new s3.Bucket(this, bucketName, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: [s3.HttpMethods.PUT],
          allowedOrigins: ['*'],
          exposedHeaders: [],
        },
      ],
    });

    // Policy to allow anyone to put objects into the bucket
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:PutObject'],
      resources: [`${bucket.bucketArn}/*`],
      principals: [new iam.AnyPrincipal()],
    }));

    // Policy to deny all other actions except to the bucket owner
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject', 's3:ListBucket', 's3:DeleteObject', 's3:PutObjectAcl', 's3:GetObjectAcl'],
      resources: [`${bucket.bucketArn}`, `${bucket.bucketArn}/*`],
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
      conditions: {
        StringNotEquals: {
          "aws:PrincipalArn": [`arn:aws:iam::${cdk.Aws.ACCOUNT_ID}:root`],
        },
      },
    }));

    return bucket;
  }

  private createDynamoDBTable(tableName: string): dynamodb.Table {
    return new dynamodb.Table(this, tableName, {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }

  private createLambdaFunction(functionName: string, bucket: s3.Bucket, table: dynamodb.Table, assetPath: string, handler: string): lambda.Function {
    const lambdaFunction = new lambda.Function(this, functionName, {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromAsset(assetPath),
      handler: handler,
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: table.tableName,
      },
    });

    // Grant the Lambda function read/write permissions to the S3 bucket
    bucket.grantReadWrite(lambdaFunction);
    // Grant the Lambda function read/write permissions to the DynamoDB table
    table.grantReadWriteData(lambdaFunction);

    return lambdaFunction;
  }

  private createApiGateway(lambdaFunction: lambda.Function, apiName: string): apigateway.LambdaRestApi {
    const api = new apigateway.LambdaRestApi(this, apiName, {
      handler: lambdaFunction,
      proxy: false,
    });

    // add a /add-item resource to the API Gateway
    const addItemResource = api.root.addResource('add-item');
    addItemResource.addMethod('POST', new apigateway.LambdaIntegration(lambdaFunction), {
      // Enable CORS
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
          },
        },
      ],
    });

    // Add an OPTIONS method to handle CORS preflight requests
    addItemResource.addMethod('OPTIONS', new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
          },
        },
      ],
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    }), {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
          },
        },
      ],
    });

    return api;
  }
}
