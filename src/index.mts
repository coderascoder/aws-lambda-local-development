import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { S3Operation } from './s3Operation.mjs';

const s3Endpoint = process.env.AWS_S3_SERVER || 'http://192.168.56.101:4566';
const region = 'ap-southeast-2';
const bucketName = 'aaa';

const s3ops = new S3Operation(region, s3Endpoint);


export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  await s3ops.createBucketIfNotExist(bucketName);
  await s3ops.putObjectToS3(bucketName, 'aaa', 'myvalue');
  const value = await s3ops.getObjectFromS3(bucketName, 'aaa');

  console.log('======================', value)
  return {
      statusCode: 200,
      body: JSON.stringify({
          message: 'hello world',
      }),
  };
};
