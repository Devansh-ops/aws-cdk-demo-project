# Coding Challenge

The goal was to use CDK and Cloudformation to deploy an app on AWS. The stack includes the following resources:
- Lambda function
- S3 Bucket
- API Endpoint
- DynamoDB Table

## Set AWS account and region

on Windows (CMD)
```bash
set CDK_DEFAULT_ACCOUNT=your-account-id
set CDK_DEFAULT_REGION=your-region
set AWS_REGION=your-region
set AWS_DEFAULT_REGION=your-region
set AWS_ACCESS_KEY_ID=your-access-key-id
set AWS_SECRET_ACCESS_KEY=your-access-key-secret
```

on macOS/Linux
```bash
export CDK_DEFAULT_ACCOUNT=your-account-id
export CDK_DEFAULT_REGION=your-region
export AWS_REGION=your-region
export AWS_DEFAULT_REGION=your-region
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-access-key-secret
```

## Steps to run

1. Install AWS CLI
2. `aws configure`
3. Install cdk 
4. Clone the repo and cd into it
5. export / set the variables
6. Deploy the stack (also installs npm packages, and creates config)
```bash
npm run deploy
```
7. Run the frontend
```bash
cd fovus-file-upload && npm start
```
8. open the app at `localhost:3000`