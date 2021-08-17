#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkInfrastructureStack } from '../lib/cdk-infrastructure-stack';

const app = new cdk.App();
new CdkInfrastructureStack(app, 'CdkInfrastructureStack');
