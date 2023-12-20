#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import * as dotenv from 'dotenv'
import { AWSYakumiClientStack } from '../lib/cdk-stack'

dotenv.config()
const envList = [
  'PROJECT_ID',
  'BUCKET_NAME',
  'DISTRIBUTION_ID',
  'TAG_PROJECT_NAME',
  'DOMAIN_NAME',
] as const
for (const key of envList) {
  if (!process.env[key]) throw new Error(`please add ${key} to .env`)
}
const processEnv = process.env as Record<typeof envList[number], string>

const app = new cdk.App()
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}
const projectId = processEnv.PROJECT_ID

new AWSYakumiClientStack(app, `${projectId}-stack`, {
  bucketName: processEnv.BUCKET_NAME,
  projectId: `${projectId}`,
  distributionId: processEnv.DISTRIBUTION_ID,
  domainName: processEnv.DOMAIN_NAME,
  projectNameTag: processEnv.TAG_PROJECT_NAME,
  env,
})
