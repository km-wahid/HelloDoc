
1. Install dependencies:
   `npm install`
2. Copy env template and configure AI provider:
   `cp .env.example .env`
3. For Gemini now, set:
   - `AI_PROVIDER="gemini"`
   - `GEMINI_API_KEY="..."`
4. Run AI API server:
   `npm run dev:api`
5. Run the app:
   `npm run dev`
6. Authentication and assessment data are currently stored in browser `localStorage` (temporary mode, no Firebase required).
