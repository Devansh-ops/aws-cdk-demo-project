import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3, aws_dynamodb as dynamodb, aws_lambda as lambda, aws_apigateway as apigateway, aws_ec2 as ec2, aws_iam as iam, aws_lambda_event_sources as lambdaEventSources } from 'aws-cdk-lib';

export class FovusCodingChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const bucket = new s3.Bucket(this, 'InputBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // bucket.addToResourcePolicy(new iam.PolicyStatement({
    //   actions: ['s3:PutObject'],
    //   resources: [`${bucket.bucketArn}/*`],
    //   principals: [new iam.AnyPrincipal()],
    // }));

    // Add a more restrictive policy
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:PutObject'],
      resources: [`${bucket.bucketArn}/*`],

    // DynamoDB Table with stream enabled
    const table = new dynamodb.Table(this, 'FileTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      stream: dynamodb.StreamViewType.NEW_IMAGE,
    });

    // Lambda Function to save metadata
    const saveMetadataFunction = new lambda.Function(this, 'SaveMetadataFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: table.tableName,
      },
    });

    bucket.grantReadWrite(saveMetadataFunction);
    table.grantWriteData(saveMetadataFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'api', {
      restApiName: 'Metadata Service',
      description: 'This service saves file metadata.',
    });

    const postIntegration = new apigateway.LambdaIntegration(saveMetadataFunction);
    api.root.addMethod('POST', postIntegration);

    // EC2 Instance Role and Profile
    const role = new iam.Role(this, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM'),
      ],
    });

    // Restrict S3 access to the specific bucket
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:*'],
      resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
    }));

    const instanceProfile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
      roles: [role.roleName],
    });

    // EC2 Instance
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 3 });
    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: new ec2.InstanceType('t3.micro'),
      machineImage: new ec2.AmazonLinuxImage(),
      role,
    });

    // Add script to the EC2 instance
    const userDataScript = `
      #!/bin/bash
      aws s3 cp s3://${bucket.bucketName}/script.sh /home/ec2-user/script.sh
      chmod +x /home/ec2-user/script.sh
      /home/ec2-user/script.sh
    `;
    instance.addUserData(userDataScript);

    // Lambda Function to process DynamoDB Stream
    const processStreamFunction = new lambda.Function(this, 'ProcessStreamFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'processStream.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: table.tableName,
        INSTANCE_ID: instance.instanceId,
      },
    });

    table.grantStreamRead(processStreamFunction);

    // Add IAM policy for EC2 permissions
    const instanceArn = `arn:aws:ec2:${this.region}:${this.account}:instance/${instance.instanceId}`;
    processStreamFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ec2:StartInstances', 'ec2:StopInstances'],
      resources: [instanceArn],
    }));

    // Add stream to Lambda trigger
    processStreamFunction.addEventSource(new lambdaEventSources.DynamoEventSource(table, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
    }));
  }
}
