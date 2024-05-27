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