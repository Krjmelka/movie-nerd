#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MovieNerdStack } from '../lib/MovieNerdStack';

const app = new cdk.App();
new MovieNerdStack(app, 'MovieNerdStack');