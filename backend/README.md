# OriginChecker Backend API

## Setup

1. Install dependencies:
   ```bash
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. Set your Groq API key in `.env`:
   ```
   GROQ_API_KEY=your-actual-api-key
   ```

3. Run the server:
   ```bash
   python app.py
   ```

4. Test the API:
   ```bash
   curl http://localhost:5000/api/health
   ```

## Deploy

Push to GitHub and deploy to Render, Railway, or Vercel.
