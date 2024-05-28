const { execSync } = require('child_process');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Function to deploy the CDK stack
function deployCDKStack(stackName) {
  console.log(`Bootstrapping CDK`);
  execSync(`cdk bootstrap --require-approval never`, { stdio: 'inherit' });
  console.log('CDK Bootstrapped');
  console.log(`Deploying CDK stack: ${stackName}...`);
  execSync(`cdk deploy ${stackName} --require-approval never`, { stdio: 'inherit' });
  console.log('CDK stack deployed.');
}

// Function to get the CloudFormation output
function getStackOutput(stackName, outputKey) {
  const cloudformation = new AWS.CloudFormation();
  return cloudformation.describeStacks({ StackName: stackName }).promise()
    .then(data => {
      const outputs = data.Stacks[0].Outputs;
      const output = outputs.find(output => output.OutputKey === outputKey);
      return output.OutputValue;
    });
}

// Function to update the React app's .env file
function updateEnvFile(key, value) {
  const envFilePath = path.join(__dirname, './fovus-file-upload/.env');
  let envContent = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf8') : '';

  const envKeyValuePattern = new RegExp(`^${key}=.*`, 'm');

  if (envKeyValuePattern.test(envContent)) {
    envContent = envContent.replace(envKeyValuePattern, `${key}=${value}`);
  } else {
    envContent += `\n${key}=${value}\n`;
  }

  fs.writeFileSync(envFilePath, envContent, 'utf8');
  console.log(`Updated .env file with ${key}: ${value}`);
}

// Function to install npm dependencies
function installDependencies() {
  const parentDir = __dirname;
  const appDir = path.join(__dirname, 'fovus-file-upload');
  const lambdaDir = path.join(__dirname, 'lambda');

  console.log('Installing npm dependencies in the parent directory...');
  execSync(`npm install`, { cwd: parentDir, stdio: 'inherit' });
  console.log('Npm dependencies installed.');

  console.log('Installing npm dependencies in the app directory...');
  execSync(`npm install`, { cwd: appDir, stdio: 'inherit' });
  console.log('Npm dependencies installed.');

  console.log('Installing npm dependencies in the lambda directory...');
  execSync(`npm install`, { cwd: lambdaDir, stdio: 'inherit' });
  console.log('Npm dependencies installed.');
}

// Function to zip the lambda directory
function zipLambdaDirectory() {
  const lambdaDir = path.join(__dirname, 'lambda');
  const zipFilePath = path.join(__dirname, 'lambda.zip');
  console.log('Zipping lambda directory...');
  execSync(`zip -r ${zipFilePath} .`, { cwd: lambdaDir, stdio: 'inherit' });
  console.log('Lambda directory zipped.');
}

// Main script
(async () => {
  const defaultStackName = 'FovusCodingChallengeStack';
  const stackName = process.argv[2] || defaultStackName;

  try {
    installDependencies();
    zipLambdaDirectory();
    deployCDKStack(stackName);
    const bucketUrl = await getStackOutput(stackName, 'BucketURL');
    const bucketName = await getStackOutput(stackName, 'BucketName');
    const ApiEndpoint = await getStackOutput(stackName, 'ApiEndpoint');
    updateEnvFile("REACT_APP_S3_BUCKET_URL", bucketUrl);
    updateEnvFile("REACT_APP_S3_BUCKET_NAME", bucketName);
    updateEnvFile("REACT_APP_API_ENDPOINT", ApiEndpoint);

  } catch (error) {
    console.error('Error:', error);
  }
})();
