import {AzureOpenAI} from 'openai'

export const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiKey: process.env.AZURE_OPENAI_API_KEYS!,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
  apiVersion: process.env.AZURE_OPEN_AI_VERSION!
})