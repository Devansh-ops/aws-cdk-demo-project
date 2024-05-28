const { execSync } = require('child_process');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Function to destroy the CDK stack
function destroyCDKStack(stackName) {
    console.log(`Destroying CDK stack: ${stackName}...`);
    execSync(`cdk destroy ${stackName} --force`, { stdio: 'inherit' });
    console.log('CDK stack destroyed.');
}

// Function to remove the CloudFormation output
function removeStackOutput(stackName, outputKey) {
    const cloudformation = new AWS.CloudFormation();
    return cloudformation.describeStacks({ StackName: stackName }).promise()
        .then(data => {
            const outputs = data.Stacks[0].Outputs;
            const output = outputs.find(output => output.OutputKey === outputKey);
            if (output) {
                return cloudformation.deleteStack({ StackName: stackName }).promise();
            }
            return Promise.resolve();
        });
}

// Function to remove the S3 bucket URL from the React app's .env file
function removeEnvFile() {
    const envFilePath = path.join(__dirname, './fovus-file-upload/.env');
    if (fs.existsSync(envFilePath)) {
        fs.unlinkSync(envFilePath);
        console.log('.env file removed.');
    } else {
        console.log('.env file does not exist.');
    }
}

// Main script
(async () => {
    const defaultStackName = 'FovusCodingChallengeStack';
    const stackName = process.argv[2] || defaultStackName;

    try {
        removeEnvFile();
        await removeStackOutput(stackName, 'BucketURL');
        destroyCDKStack(stackName);
    } catch (error) {
        console.error('Error:', error);
    }
})();