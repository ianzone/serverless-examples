const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({ region: process.env.REGION });
const BUCKET_NAME = process.env.BUCKET_NAME;

exports.handler = async (event, context) => {
  const logTrace = {
    logGroup: context.logGroupName,
    logStream: context.logStreamName,
    requestId: context.awsRequestId
  };
  try {
    const { path, fileName } = event.queryStringParameters;
    const commandParams = {
      Bucket: BUCKET_NAME,
      Key: `${path}/${fileName}`,
    };
    const command = new PutObjectCommand(commandParams);
    const url = await getSignedUrl(s3Client, command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...logTrace,
        url: url
      }),
    }
  } catch (err) {
    console.error('ERROR', err);
    return {
      statusCode: 500,
      body: JSON.stringify(logTrace),
    }
  }
};