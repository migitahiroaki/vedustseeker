import { handler } from "@/seeker";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const sampleEvent: APIGatewayProxyEventV2 = {
  version: "2.0",
  routeKey: "$default",
  rawPath: "/",
  rawQueryString: "deviationLT=0&dustUnitPriceLT=0.6",
  headers: {
    host: "localhost",
  },
  queryStringParameters: {
    id: "123",
    search: "test",
    deviationLT: "0",
    dustUnitPriceLT: "0.6",
  },
  requestContext: {
    accountId: "123456789012",
    apiId: "api-id",
    domainName: "localhost",
    domainPrefix: "localhost",
    http: {
      method: "GET",
      path: "/",
      protocol: "HTTP/1.1",
      sourceIp: "127.0.0.1",
      userAgent: "Custom",
    },
    requestId: "id",
    routeKey: "$default",
    stage: "$default",
    time: "01/Jan/1970:00:00:00 +0000",
    timeEpoch: 0,
  },
  isBase64Encoded: false,
};

handler(sampleEvent);
