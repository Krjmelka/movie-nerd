import { handler } from '../hello';
import { Context } from 'aws-lambda';

describe('handler function', () => {
  it('should return a 200 status and the correct body', async () => {
    const event = {
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
    };
    const context: Context = {
      awsRequestId: '1234567890',
      callbackWaitsForEmptyEventLoop: true,
      functionName: 'myFunction',
      functionVersion: '1.0',
      invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:myFunction',
      memoryLimitInMB: '128',
      succeed: jest.fn(),
      fail: jest.fn(),
      logGroupName: 'loggroup1',
      logStreamName: 'streamName1',
      getRemainingTimeInMillis: jest.fn(),
      done: jest.fn()
    };
    const result = await handler(event, context, () => {});
    
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Hello from helper!');
  });
});