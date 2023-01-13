import fs from 'fs';
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { S3Operation } from './s3Operation.mjs';
import { uniqueNamesGenerator, names } from 'unique-names-generator';

// Below env variables are defined in template.yml
const s3Endpoint = process.env.AWS_ENDPOINT;
const bucketName = process.env.AWS_S3_BUCKET_NAME || '';
const region = 'ap-southeast-2';

//
const s3ops = new S3Operation(region, s3Endpoint);

//
export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  await createLargeGitHubCommitJsonFile('/tmp/append.txt');

  await s3ops.uploadFileToS3(bucketName, 'aaa', '/tmp/append.txt');

  return {
      statusCode: 200,
      body: JSON.stringify({
          message: 'hello world',
      }),      
  };
};

async function createLargeGitHubCommitJsonFile(filePath: string) {
  const orgs = [
    'CIO4Tech',
    'CDAO',
    'DOT',
    'RBS',
    'PSU',
  ];

  try {    
    const stream = fs.createWriteStream(filePath, {flags:'a'});

    for (let i = 0; i < 10; i++) {
      const lanId = uniqueNamesGenerator({
        dictionaries: [names],
      });
  
      const name = uniqueNamesGenerator({
        dictionaries: [names, names],
        separator: ' ',
      });
  
      const a = {
        lan_id: lanId.toLowerCase(),
        name,
        email: '',
        jobFamilyGroup: 'IT Engineering',
        jobFamily: 'Software Engineering',
        commit_time: '2022-11-23',
        git_name: lanId,
        org: orgs[i % orgs.length],
      };
  
      stream.write(JSON.stringify(a) + '\n');
    }

    await new Promise(function(resolve, reject) {
      stream.end(() => resolve(''));
    });
  
  } catch (error) {
  }
}