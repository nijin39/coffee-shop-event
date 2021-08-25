#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BranchCode } from "../lib/stack-types";
import { CdkBackendStack } from '../lib/main-stack';

const backend_account_id = process.env.BACKEND_ACCOUNT_ID || "181254829549";
const toolchain_account_id = process.env.AWS_ACCOUNT_ID || "914252348054";
const region = process.env.AWS_REGION || "ap-northeast-2";

// AWS_BRANCH 는 연결된 Backend Branch 이름
const userBranch = process.env.AWS_BRANCH || BranchCode.Local;

const props = {
  env: {
    account: backend_account_id,
    region: region,
  },
  trustedAccount: toolchain_account_id,
  Region: region,
  UserBranch: userBranch,
  Account: toolchain_account_id,
  BackendAccount: backend_account_id,
}

const app = new cdk.App();
new CdkBackendStack(app, 'CoffeeShopEventApp-stack-' + userBranch, {...props});

app.synth();