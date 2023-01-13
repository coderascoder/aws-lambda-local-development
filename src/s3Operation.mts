import { S3Client, GetObjectCommand, PutObjectCommand, CreateBucketCommand, S3 } from "@aws-sdk/client-s3";
import fs from 'fs';
import { Stream } from 'stream';
import { Upload } from "@aws-sdk/lib-storage";

export class S3Operation {
  private readonly s3Client: S3Client;

  constructor(region: string, s3Endpoint: string | undefined) {
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

  async uploadFileToS3(bucket: string, key: string, filePath: string) {

    try {
      const fileStream =  fs.createReadStream(filePath);

      // const passThrough = new Stream.PassThrough();
      // fileStream.pipe(passThrough);
      
      const upload = new Upload({
        client: this.s3Client,
        params: {
            Bucket: bucket,
            Key: key,
            Body: fileStream,
            // ContentType: file.mimetype,
        }
      });

      await upload.done();
    } catch (error) {
      console.error('Error of uploadFileToS3', error)
    } finally {
    }
  }
}