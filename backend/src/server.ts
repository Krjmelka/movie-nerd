import express from 'express';
import cors from 'cors';
import { createFakeContext } from './utils/lambdaWrapper.util';
import { registeredLambdas } from './handlers';
import dotenv from 'dotenv';
import path from 'path';
import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { StrictAPIGatewayProxyResult } from './types';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

registeredLambdas.forEach(lambda => {
  const { moduleName, moduleFunction, apiPaths, method } = lambda;
  const lambdaHandler = require(`./handlers/${moduleName}`)[
    moduleFunction
  ] as APIGatewayProxyHandlerV2;

  const context = createFakeContext();

  if (method === 'GET') {
    apiPaths.forEach(path => {
      app.get(path, async (req, res) => {
        const event = {
          headers: req.headers,
          rawPath: req.path,
          queryStringParameters: req.query,
          requestContext: {
            http: {
              method: 'GET',
            },
          },
        } as APIGatewayProxyEventV2;

        try {
          const result = (await lambdaHandler(
            event,
            context,
            () => {}
          )) as StrictAPIGatewayProxyResult;
          if (result) {
            res.status(result.statusCode).send(JSON.parse(result.body));
          }
        } catch (error) {
          res.status(500).send({ error: 'Error invoking Lambda' });
        }
      });
    });
  } else if (method === 'POST') {
    apiPaths.forEach(path => {
      app.post(path, async (req, res) => {
        const event = {
          headers: req.headers,
          rawPath: req.path,
          queryStringParameters: req.query,
          body: JSON.stringify(req.body),
          requestContext: {
            http: {
              method: 'POST',
            },
          },
        } as APIGatewayProxyEventV2;

        try {
          const result = (await lambdaHandler(
            event,
            context,
            () => {}
          )) as StrictAPIGatewayProxyResult;
          if (result) {
            res.status(result.statusCode).send(JSON.parse(result.body));
          }
        } catch (error) {
          res.status(500).send({ error: 'Error invoking Lambda' });
        }
      });
    });
  }
});

app.listen(port, () => {
  console.log(`Local Lambda server is running on http://localhost:${port}`);
});
