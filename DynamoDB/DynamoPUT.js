const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: process.env.REGION });
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event, context) => {
  const logTrace = {
    logGroup: context.logGroupName,
    logStream: context.logStreamName,
    requestId: context.awsRequestId
  };
  try {
    const { id, jsonItem } = JSON.parse(event.body);
    console.log(event.body)

    const params = {
      TableName: TABLE_NAME,
      Item: marshall({
        id: id,
        data: jsonItem,
      }),
    };
    await client.send(new PutItemCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify(logTrace),
    }
  } catch (err) {
    console.error('ERROR', err);
    return {
      statusCode: 500,
      body: JSON.stringify(logTrace),
    }
  }
};