from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
import re
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure CORS for production
CORS(app, resources={
    r"/api/*": {
        "origins": os.environ.get("ALLOWED_ORIGINS", "*").split(","),
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def split_into_sentences(text):
    """Split text into sentences"""
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sentences if s.strip()]

def analyze_with_groq(text):
    """
    Use Groq to analyze if text is AI-generated
    Single API call for entire analysis
    """
    
    # Split text into sentences first
    sentences = split_into_sentences(text)
    
    # Create a numbered list of sentences for Groq
    numbered_sentences = "\n".join([f"{i+1}. {s}" for i, s in enumerate(sentences)])
    
    prompt = f"""You are an expert at detecting AI-generated text. Analyze the following text and determine if it was written by AI or a human.

Text to analyze:
{text}

The text has been split into {len(sentences)} sentences:
{numbered_sentences}

Provide your analysis in the following JSON format:
{{
    "overall_probability": <number between 0-100 indicating overall likelihood of AI generation>,
    "reasoning": "<brief 1-2 sentence explanation>",
    "sentence_analyses": [
        {{
            "sentence_number": 1,
            "probability": <number between 0-1 indicating AI likelihood for this specific sentence>
        }},
        ...
    ]
}}

Consider these factors:
- Writing style naturalness and flow
- Vocabulary variety and word choice
- Sentence structure patterns and variety
- Presence of human elements: typos, informal language, contractions, slang, personal voice
- Emotional authenticity and personality
- Context consistency across sentences
- Transitions between ideas

IMPORTANT: Base sentence probabilities on the OVERALL document context. If the document is highly AI-like (formal, structured, repetitive), most sentences should have HIGH probabilities (0.7-0.9). If it's human-like (informal, varied, personal), most sentences should have LOW probabilities (0.1-0.4).

Respond ONLY with valid JSON, no additional text."""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI detection expert. You analyze text and respond only in valid JSON format. You maintain consistency - if a document is AI-generated, most sentences should reflect high AI probability."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.2,  # Lower temperature for more consistent results
            max_tokens=4000,
        )
        
        response_text = chat_completion.choices[0].message.content
        
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group()
        
        result = json.loads(response_text)
        
        # Map sentence analyses back to actual sentence text
        sentence_analyses = result.get('sentence_analyses', [])
        formatted_sentences = []
        
        for i, sentence_text in enumerate(sentences):
            # Find corresponding analysis
            analysis = next(
                (s for s in sentence_analyses if s.get('sentence_number') == i + 1),
                {'probability': result.get('overall_probability', 50) / 100}
            )
            
            prob = analysis.get('probability', 0.5)
            # Ensure probability is in 0-1 range
            if prob > 1:
                prob = prob / 100
            
            formatted_sentences.append({
                'text': sentence_text,
                'prob': prob
            })
        
        return {
            'overall_probability': result.get('overall_probability', 50),
            'reasoning': result.get('reasoning', ''),
            'sentences': formatted_sentences
        }
        
    except Exception as e:
        print(f"Groq API error: {e}")
        raise

def generate_headline(percentage_ai):
    """Generate headline based on AI probability"""
    if percentage_ai > 70:
        return "Your document is most likely AI-generated."
    elif percentage_ai > 40:
        return "Your document may contain some AI-generated content."
    else:
        return "Your document is likely written by a human."

@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    """
    Endpoint to analyze text for AI generation using Groq
    Expects JSON: {"text": "text to analyze"}
    Returns: {"headline": str, "percentageAi": int, "sentences": []}
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text']
        
        if not text.strip():
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Check if API key is set
        if not os.environ.get("GROQ_API_KEY"):
            return jsonify({'error': 'GROQ_API_KEY not set in environment variables'}), 500
        
        # Analyze with Groq (single API call)
        groq_result = analyze_with_groq(text)
        
        # Extract results
        percentage_ai = int(groq_result.get('overall_probability', 50))
        headline = generate_headline(percentage_ai)
        sentences = groq_result.get('sentences', [])
        
        # Return result in expected format
        result = {
            'headline': headline,
            'percentageAi': percentage_ai,
            'sentences': sentences,
            'reasoning': groq_result.get('reasoning', '')
        }
        
        return jsonify(result), 200
    
    except json.JSONDecodeError as e:
        return jsonify({'error': f'Failed to parse Groq response: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    has_api_key = bool(os.environ.get("GROQ_API_KEY"))
    return jsonify({
        'status': 'healthy',
        'groq_configured': has_api_key
    }), 200

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'service': 'OriginChecker API',
        'version': '1.0.0',
        'endpoints': {
            'analyze': '/api/analyze (POST)',
            'health': '/api/health (GET)'
        }
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)