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
5. export / set the variables `CDK_DEFAULT_ACCOUNT`, `CDK_DEFAULT_REGION`, and `AWS_REGION`
6. Install packages
```bash
npm i
```
7. Deploy and Update config
```bash
npm run deploy STACKNAME
```
default stack is `FovusCodingChallengeStack` , if it is not passed
8. cd into the react app
```bash
cd fovus-file-upload
```
9. Start the app
```bash
npm start
```
10. open the app at `localhost:3000`