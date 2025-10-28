from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Load Hugging Face sentiment analysis model
sentiment_model = pipeline("sentiment-analysis")  # Default: distilbert-base-uncased-finetuned-sst-2-english

# test endpoint
@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "AI Service is running!", "status": "OK"}), 200

# Test sentiment analysis 
@app.route("/analyze", methods=["POST"])
def analyze_text():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Please provide 'text' in JSON body"}), 400
    
    text = data["text"]
    result = sentiment_model(text)[0]
    
    return jsonify({
        "text": text,
        "sentiment_label": result["label"],
        "sentiment_score": result["score"]
    }), 200

# Endpoint to process a single feedback by ID
@app.route("/process-feedback/<int:feedback_id>", methods=["GET"])
def process_feedback(feedback_id):
    #  Fetch feedback from Feedback Service
    feedback_url = f"http://localhost:8080/api/feedback/{feedback_id}"
    resp = requests.get(feedback_url)
    if resp.status_code != 200:
        return jsonify({"error": "Feedback not found"}), 404

    feedback = resp.json()
    message = feedback["message"]

    #  Run sentiment analysis
    result = sentiment_model(message)[0]  # returns {'label': 'POSITIVE', 'score': 0.99}

    # Build enriched feedback
    enriched_feedback = {
        "id": feedback["id"],
        "userName": feedback.get("userName"),
        "email": feedback.get("email"),
        "message": message,
        "source":feedback.get("source"),
        "sentiment_label": result["label"],
        "sentiment_score": result["score"]
    }

    # Send to analytics service
    analytics_url = "http://localhost:8081/api/analytics"
    try:
        requests.post(analytics_url, json={
            "userName": feedback["userName"],
            "email": feedback["email"],
            "message": message,
            "source": feedback.get("source"),
            "sentimentLabel": result["label"],
            "sentimentScore": result["score"],
            "createdAt": datetime.now().isoformat()
        })
    except requests.exceptions.RequestException as e:
        print(f"Failed to send to analytics service: {e}")

    # Return enriched data 
    return jsonify(enriched_feedback), 200

if __name__ == "__main__":
    app.run(port=4000, debug=True)