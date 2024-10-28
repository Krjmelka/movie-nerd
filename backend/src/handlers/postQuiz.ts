import { Handler } from 'aws-lambda';
import { helperFunction } from '../helpers/hello.util'

export const handler: Handler = async (event) => {
  console.log("Event: ", event);
  const message = helperFunction('postQuiz')
  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
      input: event,
    }),
  };
};