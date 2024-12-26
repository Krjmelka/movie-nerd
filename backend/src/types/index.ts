import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

export interface StrictAPIGatewayProxyResult
  extends Omit<APIGatewayProxyStructuredResultV2, 'statusCode' | 'body'> {
  statusCode: number;
  body: string;
}
