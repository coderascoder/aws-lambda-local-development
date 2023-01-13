import { S3Client, GetObjectCommand, PutObjectCommand, CreateBucketCommand, S3 } from "@aws-sdk/client-s3";

export class S3Operation {
  private readonly s3Client: S3Client;

  constructor(region: string, s3Endpoint: string) {
    this.s3Client = new S3Client({ region, endpoint: s3Endpoint,  forcePathStyle: true});
  }

  async createBucketIfNotExist(bucket: string){
    try {
      const command = new CreateBucketCommand({
        Bucket : bucket,
      });
    
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error of createBucketIfNotExist', error)
    } finally {
    }
  }

  async getObjectFromS3(bucket: string, key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket : bucket,
        Key : key,
      });
    
      const data: any = await this.s3Client.send(command);

      return await data.Body.transformToString();
    } catch (error) {
      console.error('Error of getObjectFromS3', error)
    }

    return null;
  }

  async putObjectToS3(bucket: string, key: string, data: any) {
    const command = new PutObjectCommand({
      Bucket : bucket,
      Key : key,
      Body : JSON.stringify(data),
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error of putObjectToS3', error)
    } finally {
    }
  }
}