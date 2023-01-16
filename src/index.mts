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
  await generateTestJSON();

  return {
      statusCode: 200,
      body: JSON.stringify({
          message: 'hello world',
      }),      
  };
};

async function generateTestJSON() {
  await createLargeGitHubCommitJsonFile('/tmp/git.json');
  await createLargeHrJsonFile('/tmp/hr.json');
  await s3ops.uploadFileToS3(bucketName, 'raw/github-commits/github-commits.json', '/tmp/git.json');
  await s3ops.uploadFileToS3(bucketName, 'hr/hr.json', '/tmp/hr.json');
}

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

    for (let i = 0; i < 100000; i++) {
      const lanId = `lanid_${i}`;
  
      const name = uniqueNamesGenerator({
        dictionaries: [names, names],
        separator: ' ',
      });
  
      const item = {
        lan_id: lanId.toLowerCase(),
        name,
        email: '',
        jobFamilyGroup: 'IT Engineering',
        jobFamily: 'Software Engineering',
        commit_time: '2022-11-23',
        git_name: lanId,
        org: orgs[i % orgs.length],
      };
  
      stream.write(JSON.stringify(item) + '\n');
    }

    await new Promise(function(resolve, reject) {
      stream.end(() => resolve(''));
    });
  } catch (error) {
    console.log('====> Error of createLargeGitHubCommitJsonFile', error)
  }
}

async function createLargeHrJsonFile(filePath: string) {
  const orgs = [
      'CIO4Tech',
      'CDAO',
      'DOT',
      'RBS',
      'PSU',
  ];
  
  const gm = [
      'Brendan H',
      'Lisa Lee',
      'Tom Hank',
      'Jim Trump',
      'Lucy Anstice',
  ];
  
  const em = [
      'Jim Monday',
      'Tom tuesday',
      'Paris Wednesday',
      'Ameri thursday',
      'Luise Friday',
      'Plane Sat',
      'Church Sunday',
  ];
  
  try {
      const stream = fs.createWriteStream(filePath, { flags: 'w' });
      
      for (let i = 0; i < 50000; i++) {
          const lanId = `lanid_${i}`;

          const name = uniqueNamesGenerator({
              dictionaries: [names, names],
              separator: ' ',
          });
          
          const item = {
              lan_id: lanId.toLowerCase(),
              name,
              email: '',
              jobFamily: 'Software Engineering',
              git_name: lanId,
              org: orgs[i % orgs.length],
              em: em[i % em.length],
              gm: gm[i % gm.length]
          };
          stream.write(JSON.stringify(item) + '\n');
      }
      
      await new Promise(function (resolve, reject) {
          stream.end(() => resolve(''));
      });
  }
  catch (error) {
      console.log('====> Error of createLargeHrJsonFile', error)
  }
}
