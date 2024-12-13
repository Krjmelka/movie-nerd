import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import { registeredLambdas } from '@movie-nerd/backend/src/handlers';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from 'aws-cdk-lib/aws-apigatewayv2';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export class MovieNerdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const mongoDbUri = process.env.MONGODB_URI!;
    if (!mongoDbUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    const uiBucket = new Bucket(this, 'MovieNerdUIBucket', {
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const distribution = new Distribution(this, 'MovieNerdUIDistribution', {
      defaultBehavior: {
        origin: new S3Origin(uiBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    const httpApi = new HttpApi(this, 'HttpApi', {
      description: 'API Gateway for Movie Nerd',
      corsPreflight: {
        allowOrigins: [`https://${distribution.domainName}`],
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.OPTIONS,
        ],
      },
    });

    registeredLambdas.forEach(registeredLambda => {
      const lambdaFunction = new NodejsFunction(
        this,
        `MovieNerdLambda-${registeredLambda.moduleName}`,
        {
          runtime: Runtime.NODEJS_18_X,
          entry: path.join(
            __dirname,
            `../../backend/src/handlers/${registeredLambda.moduleName}.ts`
          ),
          handler: registeredLambda.moduleFunction,
          environment: {
            MONGODB_URI: mongoDbUri,
          },
          bundling: {
            minify: true,
            externalModules: ['aws-sdk'],
          },
        }
      );

      httpApi.addRoutes({
        path: registeredLambda.apiPath,
        methods: [registeredLambda.method as HttpMethod],
        integration: new HttpLambdaIntegration(
          `LambdaIntegration-${registeredLambda.moduleName}`,
          lambdaFunction
        ),
      });
    });

    const distPath = path.join(__dirname, '../../frontend/dist');
    const assetsPath = path.join(distPath, 'assets');

    const files = fs.readdirSync(assetsPath);

    const jsBundleFileName = files.find(file => /^index.*\.js$/.test(file));

    if (!jsBundleFileName) {
      throw new Error('JS bundle file not found in assets directory');
    }

    const FEjsBundle = fs
      .readFileSync(path.join(assetsPath, jsBundleFileName), {
        encoding: 'utf-8',
      })
      .replace(/__API_URL__/g, `${httpApi.url}`);

    new BucketDeployment(this, 'DeployMovieNerdUI', {
      destinationBucket: uiBucket,
      distribution,
      distributionPaths: ['/*'],
      sources: [
        Source.data(`assets/${jsBundleFileName}`, FEjsBundle),
        Source.asset(path.join(__dirname, '../../frontend/dist'), {
          exclude: [`assets/${jsBundleFileName}`],
        }),
      ],
      retainOnDelete: false,
    });

    new cdk.CfnOutput(this, 'ReactAppUrl', {
      value: `https://${distribution.domainName}`,
      description: 'URL of the React application',
    });
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: httpApi.url ?? 'Somethig went wrong with the Api',
    });
  }
}
