import { APIGatewayProxyResult } from "aws-lambda";

export const createSucceed = (result: any = undefined): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> => {
  return result
    ? {
        statusCode: 200,
        body: JSON.stringify({
          message: "end",
          result: result,
        }),
      }
    : {
        statusCode: 200,
        body: JSON.stringify({
          message: "end",
        }),
      };
};

export const createFail = (msg: string): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: msg,
    }),
  };
};

export const createInvalidArgumentError = (): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "invalid argument error",
    }),
  };
};

export const createArgumentRangeError = (): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "argument range error",
    }),
  };
};
