import { Context } from 'aws-lambda';

export const createFakeContext = (): Context => {
  const context: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'myLambda',
    functionVersion: '$LATEST',
    invokedFunctionArn:
      'arn:aws:lambda:us-west-2:123456789012:function:myLambda',
    memoryLimitInMB: '128',
    awsRequestId: 'fake-aws-request-id',
    logGroupName: '/aws/lambda/myLambda',
    logStreamName: 'fake-log-stream',
    identity: undefined,
    clientContext: undefined,
    getRemainingTimeInMillis: () => 3000,
    done: () => null,
    fail: () => null,
    succeed: () => null,
  };
  return context;
};
