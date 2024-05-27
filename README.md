# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template


## Set AWS account and region to use

on Windows (CMD)
```bash
set CDK_DEFAULT_ACCOUNT=your-account-id
set CDK_DEFAULT_REGION=your-region
```

on macOS/Linux
```bash
export CDK_DEFAULT_ACCOUNT=your-account-id
export CDK_DEFAULT_REGION=your-region
```

## Bootstrap the CDK env

```bash
cdk bootstrap aws://your-account-id/your-region
```

## Steps

1. Install AWS CLI
2. `aws configure`
3. Install cdk 
4. Run the commands
```bash
mkdir fovus-coding-challenge
cd focus-coding challenge
cdk init app --language typescript
```
5. Make lib/fovus-coding-challenge-stack

```
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3, aws_dynamodb as dynamodb, aws_lambda as lambda, aws_apigateway as apigateway, aws_ec2 as ec2, aws_iam as iam, aws_lambda_event_sources as lambdaEventSources } from 'aws-cdk-lib';

export class FovusCodingChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    // Create the S3 bucket
    const bucket = new s3.Bucket(this, 'InputBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,       // Allow public ACLs to be applied
        blockPublicPolicy: false,     // Allow bucket policies to grant public access
        ignorePublicAcls: false,      // Consider public ACLs for access control
        restrictPublicBuckets: false, // Do not restrict public access at the bucket level
      }),
    });

    // Policy to allow anyone to put objects into the bucket
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:PutObject'],
      resources: [`${bucket.bucketArn}/*`],
      principals: [new iam.AnyPrincipal()],
    }));

    // Policy to deny all other actions except to the bucket owner
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: [
        's3:GetObject',
        's3:ListBucket',
        's3:DeleteObject',
        's3:PutObjectAcl',
        's3:GetObjectAcl'
      ],
      resources: [
        `${bucket.bucketArn}`,
        `${bucket.bucketArn}/*`
      ],
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
      conditions: {
        StringNotEquals: {
          "aws:PrincipalArn": [
            `arn:aws:iam::${cdk.Aws.ACCOUNT_ID}:root`,
            `arn:aws:iam::${cdk.Aws.ACCOUNT_ID}:user/devansh-aws`
          ]
        }
      }
    }));

    // Create S3 Access Point
    const accessPoint = new s3.CfnAccessPoint(this, 'InputBucketAccessPoint', {
      bucket: bucket.bucketName,
      name: 'input-bucket-access-point',
    });

    new cdk.CfnOutput(this, 'AccessPointAlias', {
      value: `arn:aws:s3:accesspoint:us-east-1:610259957758:input-bucket-access-point`,
    });
  }
}

```
6. Add / uncomment the line in `bin/fovus-coding-challenge.ts`
```
env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
```
7. export / set the variables `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION`

8. Run the commands
```bash
cdk bootstrap
cdk deploy
```

## Create the react app
```bash
npx create-react-app fovus-file-upload
cd fovus-file-upload
```
Install AWS SDK in the react app
```bash
npm install @aws-sdk/client-s3
```

