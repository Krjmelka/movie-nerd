import express from 'express';
import { createFakeContext } from './helpers/lambdaWrapper.util';
import { registeredLambdas } from './handlers'

const app = express();
const port = 3000;

app.use(express.json());

registeredLambdas.forEach((lambda) => {
  const { moduleName, moduleFunction, apiPath, method } = lambda;
  const lambdaHandler = require(`./handlers/${moduleName}`)[moduleFunction]

  const context = createFakeContext();

  if (method === 'GET') {
    app.get(apiPath, async (req, res) => {
      const event = {
        httpMethod: 'GET',
        path: req.path,
        headers: req.headers,
        queryStringParameters: req.query,
      };

      try {
        const result = await lambdaHandler(event, context);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send({ error: 'Error invoking Lambda' });
      }
    });
  } else if (method === 'POST') {
    app.post(apiPath, async (req, res) => {
      const event = {
        httpMethod: 'POST',
        path: req.path,
        headers: req.headers,
        body: JSON.stringify(req.body),
        queryStringParameters: req.query,
      };

      try {
        const result = await lambdaHandler(event, context);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send({ error: 'Error invoking Lambda' });
      }
    });
  }

})

app.listen(port, () => {
  console.log(`Local Lambda server is running on http://localhost:${port}`);
});