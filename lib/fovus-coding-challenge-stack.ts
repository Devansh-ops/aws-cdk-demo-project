import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3, aws_lambda as lambda, CfnOutput, CustomResource, aws_logs as logs, aws_iam as iam } from 'aws-cdk-lib';

export class FovusCodingChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    // Create the S3 bucket
    const bucket = new s3.Bucket(this, 'DevanshInputBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,       // Allow public ACLs to be applied
        blockPublicPolicy: false,     // Allow bucket policies to grant public access
        ignorePublicAcls: false,      // Consider public ACLs for access control
        restrictPublicBuckets: false, // Do not restrict public access at the bucket level
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

    // Output the S3 REST API endpoint
    new CfnOutput(this, 'BucketURL', {
      value: `https://${bucket.bucketName}.s3.${cdk.Aws.REGION}.amazonaws.com`,
      description: 'The REST API endpoint of the S3 bucket',
    });
  }
}
