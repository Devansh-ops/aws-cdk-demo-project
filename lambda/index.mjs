import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = process.env.TABLE_NAME;
const s3Bucket = process.env.BUCKET_NAME;

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      default:
        let requestJSON = JSON.parse(event.body);

        // Commenting out the PutCommand to DynamoDB
        /*
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: nanoid(),
              input_text: requestJSON.input_text,
              input_file_path: requestJSON.input_file_path,
            },
          })
        );
        body = `Put item ${requestJSON.id}`;
        */

        // Return the received request JSON
        body = requestJSON;
        break;
    }
  } catch (err) {
    statusCode = 400;
    body = { error: err.message };
  }

  return {
    statusCode,
    body: JSON.stringify(body),
    headers,
  };
};
