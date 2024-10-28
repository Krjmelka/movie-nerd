import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'MovieNerdReactApp', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
    })

    new s3deploy.BucketDeployment(this, 'DeployMovieNerdReactApp', {
      sources: [s3deploy.Source.asset('../../frontend/dist')],
      destinationBucket: bucket,
    })

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkStackQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
