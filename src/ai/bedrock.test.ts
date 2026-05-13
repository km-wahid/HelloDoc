// Test bedrock chat function with a sample prompt and log output
// This helps verify Bedrock is working before integrating into the app

import { chatWithBedrock } from './bedrock';

async function testBedrockChat() {
  console.log('🧪 Testing Bedrock Chat Provider...\n');

  try {
    console.log('📝 Test 1: Simple greeting');
    const response1 = await chatWithBedrock(
      [{ role: 'user', content: 'Hello! Who are you?' }],
      undefined,
      500
    );
    console.log('✅ Response:', response1.text.substring(0, 100) + '...\n');

    console.log('📝 Test 2: With system prompt');
    const response2 = await chatWithBedrock(
      [{ role: 'user', content: 'What is 2 + 2?' }],
      'You are a helpful math tutor. Provide clear explanations.',
      500
    );
    console.log('✅ Response:', response2.text.substring(0, 100) + '...\n');

    console.log('📝 Test 3: Multi-turn conversation');
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      { role: 'user', content: 'What is Python?' },
      { role: 'assistant', content: 'Python is a programming language.' },
      { role: 'user', content: 'What can I build with it?' },
    ];
    const response3 = await chatWithBedrock(messages, undefined, 500);
    console.log('✅ Response:', response3.text.substring(0, 100) + '...\n');

    console.log('🎉 All tests passed! Bedrock is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testBedrockChat();
}
