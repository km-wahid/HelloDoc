import dotenv from 'dotenv';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

dotenv.config();

const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];

async function testRegion(region) {
  try {
    const client = new BedrockRuntimeClient({ region });
    
    const params = {
      modelId: 'anthropic.claude-opus-4-6-v1',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-06-01",
        max_tokens: 100,
        system: "You are helpful.",
        messages: [{
          role: "user",
          content: "Hello"
        }]
      })
    };

    console.log(`⏳ Testing region: ${region}...`);
    const command = new InvokeModelCommand(params);
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log(`✅ Region ${region} works!\n`);
    return true;
  } catch (error) {
    console.log(`❌ Region ${region}: ${error.message}\n`);
    return false;
  }
}

console.log('🌍 Testing AWS Bedrock across regions...\n');
for (const region of regions) {
  await testRegion(region);
}
