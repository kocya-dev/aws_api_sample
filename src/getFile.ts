import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { S3Wrapper } from "./s3Wrapper";
import { createSucceed, createFail, createInvalidArgumentError, createArgumentRangeError } from "./createResponse";

// Lambda エントリーポイント
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Hello Lambda!");
  console.log(event);

  if (!event.pathParameters || !event.pathParameters["name"]) {
    return createInvalidArgumentError();
  }

  const name: string = event.pathParameters["name"];

  try {
    const s3: S3Wrapper = new S3Wrapper();
    const resultCreate: boolean = await s3.create("storage-access-bucket-test");
    console.log(resultCreate);

    const response = await s3.getStringObject(name);
    if (response) {
      console.log("SUCCESS (get item valid):", response);
      return createSucceed(response);
    } else {
      console.log("SUCCESS (no item):");
      return createFail("no item");
    }
  } catch (err) {
    console.log("ERROR:", err);
    return createFail(JSON.stringify(err));
  }
};
