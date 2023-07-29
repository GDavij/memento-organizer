sam build
sam deploy \
--region us-east-1 \
--parameter-overrides MementoOrganizerMongoConnectionStr="$MementoOrganizerMongoProductionConnectionStr" mementoOrganizerWebProductionURL="*" MementoAwsAccessKeyId="$MementoAwsAccessKeyId" MementoAwsSecretAccessKey="$MementoAwsSecretAccessKey" MementoOrganizerS3BucketName="$MementoOrganizerS3BucketName" MementoDbaUsername="$MementoDbaUsername" MementoDbaPassword="$MementoDbaPassword"