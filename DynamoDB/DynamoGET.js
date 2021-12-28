const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: process.env.REGION });
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event, context) => {
  const logTrace = {
    logGroup: context.logGroupName,
    logStream: context.logStreamName,
    requestId: context.awsRequestId
  };
  try {
    const query = event.queryStringParameters;
    console.log(query)
    const id = query.id;
    const attr = query.attr;

    const params = {
      TableName: TABLE_NAME,
      Key: marshall({
        id: id,
      }),
      ProjectionExpression: attr,
    };
    const data = await client.send(new GetItemCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ ...logTrace, ...unmarshall(data.Item) }),
    }
  } catch (err) {
    console.error('ERROR', err);
    return {
      statusCode: 500,
      body: JSON.stringify(logTrace),
    }
  }
};