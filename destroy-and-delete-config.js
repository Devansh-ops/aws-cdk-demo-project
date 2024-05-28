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
        destroyCDKStack(stackName);
    } catch (error) {
        console.error('Error:', error);
    }
})();