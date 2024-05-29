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

// Function to remove created stuff
function removeFile(relativePath) {
    const filePath = path.join(__dirname, relativePath);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(relativePath + ' file removed.');
    } else {
        console.log(relativePath + ' file does not exist.');
    }
}

// Main script
(async () => {
    const defaultStackName = 'CodingChallengeStack';
    const stackName = process.argv[2] || defaultStackName;

    try {
        removeFile('./file-upload/.env'); // Remove the React app's .env file
        destroyCDKStack(stackName);
        removeFile('lambda.zip') // Remove the lambda.zip file
    } catch (error) {
        console.error('Error:', error);
    }
})();