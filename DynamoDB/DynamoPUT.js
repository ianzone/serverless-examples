const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const Obj = require('lodash')
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

    const typed_jsonItem = Obj.mapValues(jsonItem, value => { return { S: value } })
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: { S: id },
        data: { M: typed_jsonItem },
      },
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