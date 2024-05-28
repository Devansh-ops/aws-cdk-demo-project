import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = process.env.TABLE_NAME;

const putItemToDynamoDB = async (item) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });
  return await dynamo.send(command);
};

export const handler = async (event, context) => {
  let response;

  try {
    switch (event.httpMethod) {
      case "POST":
        response = await handlePostRequest(event);
        break;
      default:
        response = {
          statusCode: 405,
          body: JSON.stringify({ message: `Unsupported method: "${event.httpMethod}"` }),
        };
        break;
    }
  } catch (error) {
    console.error("Error processing request:", error);
    response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }

  return {
    ...response,
    headers: {
      "Content-Type": "application/json",
      ...response.headers,
    },
  };
};

const handlePostRequest = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request, no body provided" }),
    };
  }

  const requestJSON = JSON.parse(event.body);
  if (!requestJSON.input_text || !requestJSON.input_file_path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing required fields: input_text, input_file_path" }),
    };
  }

  const item = {
    id: nanoid(),
    input_text: requestJSON.input_text,
    input_file_path: requestJSON.input_file_path,
  };

  await putItemToDynamoDB(item);

  return {
    statusCode: 201,
    body: JSON.stringify({ message: `Item created with id ${item.id}`, item }),
  };
};
