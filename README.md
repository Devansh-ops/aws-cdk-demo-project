## Coding Challenge - AWS Deployment with CDK

Welcome to the  Coding Challenge! This project demonstrates the deployment of a full-stack application on AWS using AWS Cloud Development Kit (CDK) and CloudFormation. The stack includes the following AWS resources:

- AWS Lambda Function
- Amazon S3 Bucket
- Amazon API Gateway
- Amazon DynamoDB Table

### Prerequisites

Before you begin, ensure you have the following installed:

- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS CDK](https://aws.amazon.com/cdk/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Set AWS Account and Region

Configure your AWS account and region by setting the necessary environment variables.

#### On Windows (CMD)

```bash
set CDK_DEFAULT_ACCOUNT=your-account-id
set CDK_DEFAULT_REGION=your-region
set AWS_REGION=your-region
set AWS_DEFAULT_REGION=your-region
set AWS_ACCESS_KEY_ID=your-access-key-id
set AWS_SECRET_ACCESS_KEY=your-access-key-secret
```

#### On macOS/Linux

```bash
export CDK_DEFAULT_ACCOUNT=your-account-id
export CDK_DEFAULT_REGION=your-region
export AWS_REGION=your-region
export AWS_DEFAULT_REGION=your-region
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-access-key-secret
```

### Steps to Run

1. **Install AWS CLI**

   Install the AWS CLI by following the instructions [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

2. **Configure AWS CLI**

   Run the following command and follow the prompts to configure your AWS CLI with your credentials:

   ```bash
   aws configure
   ```

3. **Install AWS CDK**

   Install the AWS CDK globally using npm:

   ```bash
   npm install -g aws-cdk
   ```

4. **Clone the Repository**

   Clone this repository to your local machine and navigate into the project directory:

   ```bash
   git clone https://github.com/your-repo/coding-challenge.git
   cd coding-challenge
   ```

5. **Set Environment Variables**

   Export or set the environment variables as shown in the previous section.

6. **Deploy the Stack**

   Deploy the stack to AWS. This command will also install npm packages and create the necessary configuration:

   ```bash
   npm run deploy
   ```

7. **Run the Frontend**

   Navigate to the frontend directory and start the development server:

   ```bash
   cd file-upload
   npm start
   ```

8. **Access the Application**

   Open your web browser and navigate to `http://localhost:3000` to access the application.

### Project Structure

The project is organized as follows:

- **infrastructure**: Contains the CDK stack definitions and resource configurations.
- **lambda**: Contains the source code for the Lambda function.
- **file-upload**: The React frontend application.

### Key Features

- **AWS Lambda**: Handles backend logic and interacts with DynamoDB.
- **Amazon S3**: Stores uploaded files securely.
- **Amazon API Gateway**: Provides a RESTful API to interact with the Lambda function.
- **Amazon DynamoDB**: Stores metadata and application data.


### Contact

For any questions or issues, please open an issue on this repository or contact the maintainer.

---

This project showcases the deployment of a serverless application on AWS using modern development tools and practices. Happy coding!