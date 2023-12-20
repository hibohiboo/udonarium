import * as core from 'aws-cdk-lib'
import * as cf from 'aws-cdk-lib/aws-cloudfront'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs'

const basePath = 'yakumi-udonarium'

interface Props extends core.StackProps {
  bucketName: string
  distributionId: string
  domainName: string
  projectNameTag: string
  projectId: string
}

export class AWSYakumiClientStack extends core.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)
    // CloudFront オリジン用のS3バケットへの参照を取得
    const bucket = s3.Bucket.fromBucketName(
      this,
      props.bucketName,
      props.bucketName,
    )

    // CloudFrontディストリビューションを取得
    const distribution = cf.Distribution.fromDistributionAttributes(
      this,
      props.distributionId,
      {
        domainName: '',
        distributionId: props.distributionId,
      },
    )
    // 指定したディレクトリをデプロイ
    this.deployS3(bucket, distribution, '../dist', props.bucketName)

    // 確認用にCloudFrontのURLに整形して出力
    new core.CfnOutput(this, `${props.distributionId}-top-url`, {
      value: `https://${distribution.distributionDomainName}/${basePath}`,
    })

    core.Tags.of(this).add('Project', props.projectNameTag)
  }

  private deployS3(
    siteBucket: s3.IBucket,
    distribution: cf.IDistribution,
    sourcePath: string,
    bucketName: string,
  ) {
    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(
      this,
      `${bucketName}-deploy-with-invalidation`,
      {
        sources: [s3deploy.Source.asset(sourcePath)],
        destinationBucket: siteBucket,
        distribution,
        distributionPaths: [`/${basePath}/*`],
        destinationKeyPrefix: basePath,
      },
    )
  }
}
