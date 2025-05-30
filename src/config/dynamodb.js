import AWS from 'aws-sdk'
import { env } from '~/config/environment'

const dynamoClient = new AWS.DynamoDB.DocumentClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  }
})

export default dynamoClient
