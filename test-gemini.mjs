import dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
  console.log('🧪 Testing Google Gemini API...\n');
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in .env');
    }
    
    console.log(`📤 Sending request to Gemini...`);
    console.log(`   Model: ${model}`);
    console.log(`   Key: ${apiKey.substring(0, 10)}...\n`);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'What is 2 + 2? Answer in one sentence.' }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500
          }
        }),
        signal: AbortSignal.timeout(10000)
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP ${response.status}`);
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response text from Gemini');
    }
    
    console.log('✅ SUCCESS! Gemini is working!\n');
    console.log('📝 Response:');
    console.log(text);
    console.log('\n🎉 Google Gemini API is properly configured!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

testGemini();
