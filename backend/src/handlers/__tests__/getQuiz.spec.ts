import { handler } from '../getQuiz';
import { Context } from 'aws-lambda';
import { createFakeContext } from '../../helpers/lambdaWrapper.util'

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
    const context = createFakeContext()
    const result = await handler(event, context, () => {});
    
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Hello from helper!');
  });
});