import { handler } from '../getQuiz';
import { Context, APIGatewayProxyEvent } from 'aws-lambda';
import { createFakeContext } from '../../utils/lambdaWrapper.util'

describe('handler function', () => {
  it('should return a 200 status and the correct body', async () => {
    const event: APIGatewayProxyEvent = {
      httpMethod: 'POST',
      path: '/my-endpoint',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        age: 30,
      }),
      queryStringParameters: {
        search: 'example',
      },
      resource: '/my-endpoint',
      isBase64Encoded: false,
      pathParameters: null,
      stageVariables: null,
      multiValueHeaders: {},
      multiValueQueryStringParameters: null,
      requestContext: {
        accountId: '123456789012',
        apiId: 'apiId',
        authorizer: {},
        protocol: 'HTTP/1.1',
        httpMethod: 'POST',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '127.0.0.1',
          user: null,
          userAgent: 'Custom User Agent String',
          userArn: null,
        },
        path: '/my-endpoint',
        stage: 'test',
        requestId: 'id',
        requestTimeEpoch: 1234567890,
        resourceId: 'resourceId',
        resourcePath: '/my-endpoint',
      },
    };
    const result = await handler(event);
    
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Hello from helper!');
  });
});