import express from 'express';
import cors from 'cors';
import { createFakeContext } from './utils/lambdaWrapper.util';
import { registeredLambdas } from './handlers';
import dotenv from 'dotenv';
import path from 'path';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

registeredLambdas.forEach(lambda => {
  const { moduleName, moduleFunction, apiPaths, method } = lambda;
  const lambdaHandler = require(`./handlers/${moduleName}`)[
    moduleFunction
  ] as APIGatewayProxyHandler;

  const context = createFakeContext();

  if (method === 'GET') {
    apiPaths.forEach(path => {
      app.get(path, async (req, res) => {
        const event = {
          httpMethod: 'GET',
          path: req.path,
          headers: req.headers,
          queryStringParameters: req.query,
        } as APIGatewayProxyEvent;

        try {
          const result = await lambdaHandler(event, context, () => {});
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
          httpMethod: 'POST',
          path: req.path,
          headers: req.headers,
          body: JSON.stringify(req.body),
          queryStringParameters: req.query,
        } as APIGatewayProxyEvent;

        try {
          const result = await lambdaHandler(event, context, () => {});
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
