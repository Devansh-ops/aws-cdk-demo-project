const { execSync } = require('child_process');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Function to deploy the CDK stack
function deployCDKStack() {
  console.log('Deploying CDK stack...');
  execSync('cdk deploy DevanshStack2 --require-approval never', { stdio: 'inherit' });
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
function updateEnvFile(bucketUrl) {
  const envFilePath = path.join(__dirname, './fovus-file-upload/.env');
  let envContent = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf8') : '';

  if (envContent.includes('REACT_APP_S3_BUCKET_URL')) {
    envContent = envContent.replace(/REACT_APP_S3_BUCKET_URL=.*/, `REACT_APP_S3_BUCKET_URL=${bucketUrl}`);
  } else {
    envContent += `\nREACT_APP_S3_BUCKET_URL=${bucketUrl}\n`;
  }

  fs.writeFileSync(envFilePath, envContent, 'utf8');
  console.log(`Updated .env file with S3 bucket URL: ${bucketUrl}`);
}

// Main script
(async () => {
  try {
    deployCDKStack();
    const bucketUrl = await getStackOutput('DevanshStack2', 'BucketURL');
    updateEnvFile(bucketUrl);
  } catch (error) {
    console.error('Error:', error);
  }
})();
