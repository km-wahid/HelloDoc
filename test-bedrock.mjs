import dotenv from 'dotenv';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

dotenv.config();

async function testBedrock() {
  console.log('🧪 Testing AWS Bedrock Connection...\n');
  
  try {
    const client = new BedrockRuntimeClient({ 
      region: process.env.AWS_REGION || 'us-east-1'
    });
    
    const params = {
      modelId: process.env.AWS_BEDROCK_MODEL_ID || 'anthropic.claude-opus-4-6-v1',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-06-01",
        max_tokens: 500,
        system: "You are a helpful assistant.",
        messages: [
          {
            role: "user",
            content: "What is 2 + 2? Answer in one sentence."
          }
        ]
      })
    };

    console.log('📤 Sending request to Bedrock...');
    console.log(`   Region: ${process.env.AWS_REGION}`);
    console.log(`   Model: ${process.env.AWS_BEDROCK_MODEL_ID}\n`);

    const command = new InvokeModelCommand(params);
    const response = await client.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const text = responseBody.content[0].text;
    
    console.log('✅ SUCCESS! Bedrock is working!\n');
    console.log('📝 Response:');
    console.log(text);
    console.log('\n🎉 AWS Bedrock is properly configured!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    
    if (error.message.includes('InvalidAction')) {
      console.error('\n⚠️  Model access issue - Please ensure:');
      console.error('   1. Bedrock is enabled in your AWS account');
      console.error('   2. Claude Opus model access is requested');
    }
    if (error.message.includes('InvalidAuthenticationTokenException') || 
        error.message.includes('security token')) {
      console.error('\n⚠️  Credential issue - Please verify:');
      console.error('   1. AWS_ACCESS_KEY_ID is correct');
      console.error('   2. AWS_SECRET_ACCESS_KEY is correct');
      console.error('   3. Credentials have not expired');
    }
    
    process.exit(1);
  }
}

testBedrock();
