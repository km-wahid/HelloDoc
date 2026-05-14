import dotenv from 'dotenv';
import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";

dotenv.config();

async function testBedrockModels() {
  console.log('🧪 Testing AWS Bedrock - Checking Available Models...\n');
  
  try {
    const client = new BedrockClient({ 
      region: process.env.AWS_REGION || 'us-east-1'
    });
    
    console.log(`📤 Querying available Bedrock models...`);
    console.log(`   Region: ${process.env.AWS_REGION}\n`);
    
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);
    
    console.log('✅ Connected to Bedrock!\n');
    console.log('📦 Available Models:\n');
    
    response.modelSummaries.forEach(model => {
      console.log(`   - ${model.modelId}`);
      console.log(`     Name: ${model.modelName}`);
      console.log(`     Provider: ${model.modelArn}\n`);
    });
    
    console.log('🎉 AWS Bedrock credentials are VALID!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    
    if (error.message.includes('InvalidSignatureException') || 
        error.message.includes('Authentication failed') ||
        error.message.includes('AuthFailure')) {
      console.error('\n⚠️  Authentication Error - Invalid credentials');
    }
    if (error.message.includes('UnauthorizedOperation') ||
        error.message.includes('AccessDenied')) {
      console.error('\n⚠️  Permission Error - User lacks Bedrock permissions');
    }
    if (error.message.includes('ResourceNotFoundException')) {
      console.error('\n⚠️  Bedrock not available in this region');
    }
    
    process.exit(1);
  }
}

testBedrockModels();
