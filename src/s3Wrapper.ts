import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
  GetObjectCommand,
  PutObjectCommand,
  GetObjectCommandOutput,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

export class S3Wrapper {
  private _client: S3Client;
  private _bucketName: string | undefined = undefined;

  constructor() {
    this._client = new S3Client({
      region: "ap-northeast-1",
      /*
      credentials: {
        accessKeyId: "sample",
        secretAccessKey: "sample",
      },
      */
    });
  }
  public async create(bucketName: string): Promise<boolean> {
    console.log(bucketName); // 確認用
    if (this._bucketName) return false;

    try {
      this._bucketName = bucketName;
      //S3バケットを作成する
      const response = await this._client.send(
        new CreateBucketCommand({
          Bucket: bucketName,
        })
      );
      console.log(response);
      return true;
    } catch (err) {
      console.error(err); // 既にバケットがある場合: Error.message BucketAlreadyExists
      /*
ERROR	BucketAlreadyExists: The requested bucket name is not available. The bucket namespace is shared by all users of the system. Please select a different name and try again.
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 409,
    requestId: 'VF6ZSV729PR4F01C',
    extendedRequestId: 'rKjIioOXPnwSC0qI2GM/YRYCzCWkc72dRA74E4m8wBGmi2FTOKaYSHV1Te/7A0wAORxLSraMB4w=',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Code: 'BucketAlreadyExists',
  BucketName: 'storage-access-bucket-test',
  RequestId: 'VF6ZSV729PR4F01C',
  HostId: 'rKjIioOXPnwSC0qI2GM/YRYCzCWkc72dRA74E4m8wBGmi2FTOKaYSHV1Te/7A0wAORxLSraMB4w='
}


ERROR	BucketAlreadyOwnedByYou: Your previous request to create the named bucket succeeded and you already own it.
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 409,
    requestId: '045EW26A3XPVKSAE',
    extendedRequestId: 'xyQnYiz88DlffVxi6NJmbuNqYmrhc7Iya4DNFvePjExBPKKzQVqb2n+sdXiEyOmU+BkR8+I2GjU=',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Code: 'BucketAlreadyOwnedByYou',
  BucketName: 'storage-access-bucket-test',
  RequestId: '045EW26A3XPVKSAE',
  HostId: 'xyQnYiz88DlffVxi6NJmbuNqYmrhc7Iya4DNFvePjExBPKKzQVqb2n+sdXiEyOmU+BkR8+I2GjU='
}
2023-10-09T22:20:26.533Z 7509dfc5-3207-4d7a-80c6-7f329e2bf8e8 ERROR BucketAlreadyOwnedByYou: Your previous request to create the named bucket succeeded and you already own it. at deserializeAws_restXmlBucketAlreadyOwnedByYouResponse (/var/runtime/node_modules/@aws-sdk/client-s3/dist-cjs/protocols/Aws_restXml.js:6122:23) at deserializeAws_restXmlCreateBucketCommandError (/var/runtime/node_modules/@aws-sdk/client-s3/dist-cjs/protocols/Aws_restXml.js:3162:25) at process.processTicksAndRejections (node:internal/process/task_queues:95:5) at async /var/runtime/node_modules/@aws-sdk/middleware-serde/dist-cjs/deserializerMiddleware.js:7:24 at async /var/runtime/node_modules/@aws-sdk/middleware-signing/dist-cjs/middleware.js:13:20 at async StandardRetryStrategy.retry (/var/runtime/node_modules/@aws-sdk/middleware-retry/dist-cjs/StandardRetryStrategy.js:51:46) at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/loggerMiddleware.js:6:22 at async S3Wrapper.create (/var/task/index.js:48:24) at async Runtime.handler (/var/task/index.js:189:26) { '$fault': 'client', '$metadata': { httpStatusCode: 409, requestId: '045EW26A3XPVKSAE', extendedRequestId: 'xyQnYiz88DlffVxi6NJmbuNqYmrhc7Iya4DNFvePjExBPKKzQVqb2n+sdXiEyOmU+BkR8+I2GjU=', cfId: undefined, attempts: 1, totalRetryDelay: 0 }, Code: 'BucketAlreadyOwnedByYou', BucketName: 'storage-access-bucket-test', RequestId: '045EW26A3XPVKSAE', HostId: 'xyQnYiz88DlffVxi6NJmbuNqYmrhc7Iya4DNFvePjExBPKKzQVqb2n+sdXiEyOmU+BkR8+I2GjU=' }
      */
      return true;
    }
  }
  public async delete(): Promise<boolean> {
    if (!this._bucketName) return false;

    //S3バケットを削除する
    try {
      const response = await this._client.send(
        new DeleteBucketCommand({
          Bucket: this._bucketName,
        })
      );
      this._bucketName = undefined;
      console.log(`${response}`);
      return true;
    } catch (err) {
      console.error(err);
      return true;
    }
  }
  private async getObject(key: string): Promise<GetObjectCommandOutput | undefined> {
    console.log(key); // 確認用
    if (!this._bucketName) return undefined;

    try {
      const response = await this._client.send(
        new GetObjectCommand({
          Bucket: this._bucketName,
          Key: key,
        })
      );
      console.log(response); // 確認用
      return response;
    } catch (err) {
      console.error(err);
      throw err;
      /* keyがない場合
ERROR	NoSuchKey: The specified key does not exist.
    at deserializeAws_restXmlNoSuchKeyResponse (/var/runtime/node_modules/@aws-sdk/client-s3/dist-cjs/protocols/Aws_restXml.js:6155:23)
    at deserializeAws_restXmlGetObjectCommandError (/var/runtime/node_modules/@aws-sdk/client-s3/dist-cjs/protocols/Aws_restXml.js:4353:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /var/runtime/node_modules/@aws-sdk/middleware-serde/dist-cjs/deserializerMiddleware.js:7:24
    at async /var/runtime/node_modules/@aws-sdk/middleware-signing/dist-cjs/middleware.js:13:20
    at async StandardRetryStrategy.retry (/var/runtime/node_modules/@aws-sdk/middleware-retry/dist-cjs/StandardRetryStrategy.js:51:46)
    at async /var/runtime/node_modules/@aws-sdk/middleware-flexible-checksums/dist-cjs/flexibleChecksumsMiddleware.js:56:20
    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/loggerMiddleware.js:6:22
    at async S3Wrapper.getObject (/var/task/index.js:82:24)
    at async S3Wrapper.getStringObject (/var/task/index.js:96:22) {
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 404,
    requestId: 'A44ZXDVRVNVE87SX',
    extendedRequestId: 'RIAYqvLX+uGSSRG1+SYQaUunpNEGh1KP+OXRXHtch502WJ4IN/CtUCc0kimtP8gHmiiC4NXLsMkHPrn9tLrsMg==',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Code: 'NoSuchKey',
  Key: 'test1',
  RequestId: 'A44ZXDVRVNVE87SX',
  HostId: 'RIAYqvLX+uGSSRG1+SYQaUunpNEGh1KP+OXRXHtch502WJ4IN/CtUCc0kimtP8gHmiiC4NXLsMkHPrn9tLrsMg=='
}
      */
    }
  }
  public async getStringObject(key: string): Promise<string | undefined> {
    const response = await this.getObject(key);
    return response?.Body?.transformToString();
  }
  public async getBinaryObject(key: string): Promise<Uint8Array | undefined> {
    const response = await this.getObject(key);
    return response?.Body?.transformToByteArray();
  }
  public async putStringObject(key: string, body: string): Promise<boolean> {
    console.log(key); // 確認用
    console.log(body); // 確認用
    if (!this._bucketName) return false;

    try {
      const response = await this._client.send(
        new PutObjectCommand({
          Bucket: this._bucketName,
          Key: key,
          Body: body,
        })
      );
      console.log(response); // 確認用
      /*
{
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'T6PCT0E7AXWC3B3K',
    extendedRequestId: 'WxOZ+vhfseAIS/3EoZPj/oruq5NhQg5iIwS1Tms3iGuHRy9PoPu7xvtAoz9aKX2HsFaLxyp5iIne+UZrCIQXNw==',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  ETag: '"92ac396238dbdfc6ee36abf400b1facc"',
  ServerSideEncryption: 'AES256'
}
      */
      return true;
    } catch (err) {
      console.error(err);
      // s3-ap-northeast-1.amazonaws.com
      /*
      ERROR	PermanentRedirect: The bucket you are attempting to access must be addressed using the specified endpoint. Please send all future requests to this endpoint.
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 301,
    requestId: undefined,
    extendedRequestId: '5UlhmvG1ag+P9jA8mTSXP4iby1+xds1qWf7oJ6NRXNLD9KUDCxfXH2aEpYksLjSXw73n/oGMpLy6f5nudh3B3g==',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Code: 'PermanentRedirect',
  Endpoint: 's3.amazonaws.com',
  Bucket: 'storage-access-bucket-test',
  RequestId: 'WV0SDFA0RPXSM22B',
  HostId: '5UlhmvG1ag+P9jA8mTSXP4iby1+xds1qWf7oJ6NRXNLD9KUDCxfXH2aEpYksLjSXw73n/oGMpLy6f5nudh3B3g=='
}
*/
      throw err;
    }
  }

  public async getList(): Promise<boolean> {
    if (!this._bucketName) return false;

    try {
      const response = await this._client.send(
        new ListObjectsV2Command({
          Bucket: this._bucketName,
          MaxKeys: 10, //取得件数を指定。最大1000件まで
        })
      );
      if (response.Contents) {
        const keys = response.Contents.map((d) => ({
          Key: d.Key as string,
        }));
      }
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
