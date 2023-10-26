import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, QueryCommand, GetCommandOutput, PutCommand, PutCommandInput, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
const mockDynamoDBDocumentClient = mockClient(DynamoDBDocumentClient);
import { handler } from "../api_sample1/getUser";

beforeEach(() => {
  mockDynamoDBDocumentClient.reset();
});
const getDummyAPIGatewayProxyEvent = (): APIGatewayProxyEvent => {
  return {
    pathParameters: { user_id: "1" },
    headers: {},
    multiValueHeaders: {},
    httpMethod: "GET",
    isBase64Encoded: false,
    path: "",
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {
      path: "/dev",
      accountId: "×××××××",
      resourceId: "",
      stage: "dev",
      domainPrefix: "",
      requestId: "",
      apiId: "",
      authorizer: null,
      protocol: "",
      httpMethod: "GET",
      requestTimeEpoch: 0,
      resourcePath: "",
      identity: {
        cognitoIdentityPoolId: null,
        cognitoIdentityId: null,
        apiKey: "",
        cognitoAuthenticationType: null,
        userArn: null,
        apiKeyId: "",
        userAgent: "",
        accountId: null,
        caller: null,
        sourceIp: "",
        accessKey: "",
        cognitoAuthenticationProvider: null,
        user: null,
        clientCert: null,
        principalOrgId: null,
      },
    },
    resource: "users",
    body: null,
  };
};

describe("getuser", () => {
  test("ut:getUser 成功", async () => {
    // mock準備
    mockDynamoDBDocumentClient.on(GetCommand).resolves({ Item: { id: 1, name: "test_name" } });
    const event: APIGatewayProxyEvent = getDummyAPIGatewayProxyEvent();

    // 実行
    const response: APIGatewayProxyResult = await handler(event);

    // 結果確認
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.result.id).toBe(1);
    expect(body.result.name).toBe("test_name");
  });
  test("ut:getUser 失敗 データなし", async () => {
    // mock準備
    mockDynamoDBDocumentClient.on(GetCommand).resolves({ Item: undefined });
    const event: APIGatewayProxyEvent = getDummyAPIGatewayProxyEvent();

    // 実行
    const response: APIGatewayProxyResult = await handler(event);

    // 結果確認
    expect(response.statusCode).toBe(500);
  });
  test("ut:getUser 失敗 パスパラメーター未指定", async () => {
    mockDynamoDBDocumentClient.on(GetCommand).resolves({ Item: { id: 1, name: "test_name" } });
    let event: APIGatewayProxyEvent = getDummyAPIGatewayProxyEvent();
    event.pathParameters = null;

    const response: APIGatewayProxyResult = await handler(event);

    expect(response.statusCode).toBe(500);
  });

  test("ut:getUser 失敗 パスパラメーター指定間違い", async () => {
    mockDynamoDBDocumentClient.on(GetCommand).resolves({ Item: { id: 1, name: "test_name" } });
    let event: APIGatewayProxyEvent = getDummyAPIGatewayProxyEvent();
    event.pathParameters = { faild_param: "dummy" };

    const response: APIGatewayProxyResult = await handler(event);

    expect(response.statusCode).toBe(500);
  });

  test("ut:getUser 失敗 idが数値変換不可", async () => {
    mockDynamoDBDocumentClient.on(GetCommand).resolves({ Item: { id: 1, name: "test_name" } });
    let event: APIGatewayProxyEvent = getDummyAPIGatewayProxyEvent();
    event.pathParameters = { user_id: "bad number" };

    const response: APIGatewayProxyResult = await handler(event);

    expect(response.statusCode).toBe(500);
  });

  test("ut:getUser 失敗 idの範囲間違い", async () => {
    mockDynamoDBDocumentClient.on(GetCommand).resolves({ Item: { id: 1, name: "test_name" } });
    let event: APIGatewayProxyEvent = getDummyAPIGatewayProxyEvent();
    event.pathParameters = { user_id: "-1" };

    const response: APIGatewayProxyResult = await handler(event);

    expect(response.statusCode).toBe(500);
  });

  test("it:getUser ダミー1", async () => {});

  test("getUser ダミー2", async () => {});
});
