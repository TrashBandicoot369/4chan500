#!/usr/bin/env python3
import requests
import re
import logging
import json
import datetime
import uuid
from firebase_admin_setup import db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def fetch_top_memes():
    """Fetch top 100 posts from r/memes for the past day"""
    url = "https://www.reddit.com/r/memes/top.json?t=day&limit=100"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Python/3.9 Reddit-Meme-Scraper/1.0"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        logger.error(f"Error fetching Reddit data: {e}")
        return None

def is_image_post(post_data):
    """Check if post contains an image with valid extension"""
    url = post_data.get("url", "")
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif']
    return any(url.lower().endswith(ext) for ext in valid_extensions)

def process_meme_data(post_data):
    """Extract and process data from a meme post"""
    data = post_data.get("data", {})
    
    # Get basic info
    name = data.get("title", "")
    link = f"https://reddit.com{data.get('permalink', '')}"
    image_url = data.get("url", "")
    upvotes = data.get("ups", 0)
    comments = data.get("num_comments", 0)
    upvote_ratio = data.get("upvote_ratio", 0.5)
    created_utc = data.get("created_utc", 0)
    
    # Ensure upvote_ratio is a valid number before calculation
    upvote_ratio = float(upvote_ratio) if upvote_ratio is not None else 0.5
    
    # Calculate derived metrics with proper rounding
    lulz_score = round((upvotes * upvote_ratio) + (comments * 1.5), 2)
    vibe_shift = round((upvote_ratio - 0.5) * 100, 2)
    
    # Generate ticker (first 8 characters, uppercase with underscores)
    ticker = name[:8].upper().replace(" ", "_")
    
    # Create document ID by sanitizing the title
    doc_id = re.sub(r"[^\w\-]", "", name.lower().replace(" ", "-"))
    
    # Ensure doc_id is not empty by using a fallback
    if not doc_id:
        # Use Reddit post ID if available, otherwise generate a UUID
        doc_id = data.get("id", f"meme-{uuid.uuid4().hex[:8]}")
    
    # Return structured data
    return {
        "doc_id": doc_id,
        "data": {
            "name": name,
            "link": link,
            "image_url": image_url,
            "upvotes": upvotes,
            "comments": comments,
            "upvote_ratio": upvote_ratio,
            "created_utc": created_utc,
            "lulzScore": lulz_score,
            "vibeShift": vibe_shift,
            "ticker": ticker,
            "scraped_at": datetime.datetime.now().timestamp()
        }
    }

def store_in_firestore(memes):
    """Store meme data in Firestore"""
    meme_collection = db.collection("memes")
    
    for meme in memes:
        doc_id = meme["doc_id"]
        meme_data = meme["data"]
        
        try:
            meme_collection.document(doc_id).set(meme_data)
            logger.info(f"Added meme to Firestore: {meme_data['name'][:30]}... | LULZ Score: {meme_data['lulzScore']} | Vibe Shift: {meme_data['vibeShift']}")
        except Exception as e:
            logger.error(f"Error storing meme in Firestore: {e}")

def generate_ai_summary(memes):
    # Calculate stats
    gainers = [m for m in memes if m["data"]["vibeShift"] > 0]
    losers = [m for m in memes if m["data"]["vibeShift"] < 0]
    avg_shift = round(sum(m["data"]["vibeShift"] for m in memes) / len(memes), 2)
    avg_lulz = round(sum(m["data"]["lulzScore"] for m in memes) / len(memes), 2)
    top_gainer = max(memes, key=lambda x: x["data"]["vibeShift"])["data"]
    top_loser = min(memes, key=lambda x: x["data"]["vibeShift"])["data"]

    # Build prompt
    prompt = f"""
You're a sarcastic meme market analyst. Write a one-line summary of meme market activity based on the following data:

- Average vibe shift: {avg_shift}%
- Average lulz score: {avg_lulz}
- {len(gainers)} memes gained, {len(losers)} memes dropped
- Top gainer: {top_gainer['name']} (+{top_gainer['vibeShift']}%)
- Top loser: {top_loser['name']} ({top_loser['vibeShift']}%)
"""

    # Call Groq
    headers = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
    }

    data = {
        "model": "mixtral-8x7b-32768",
        "messages": [
            {"role": "system", "content": "You are a snarky meme market analyst."},
            {"role": "user", "content": prompt.strip()}
        ],
        "temperature": 0.7
    }

    try:
        res = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data)
        res.raise_for_status()
        summary = res.json()["choices"][0]["message"]["content"].strip()
        return summary
    except Exception as e:
        print("❌ Groq error:", e)
        return "Meme market too volatile to comment."

def main():
    logger.info("Starting Reddit meme scraper")
    
    # Fetch and parse Reddit data
    reddit_data = fetch_top_memes()
    if not reddit_data:
        logger.error("Failed to fetch Reddit data")
        return
    
    # Extract posts
    posts = reddit_data.get("data", {}).get("children", [])
    logger.info(f"Fetched {len(posts)} posts from Reddit")
    
    # Filter image posts and process data
    memes = []
    for post in posts:
        if is_image_post(post.get("data", {})):
            memes.append(process_meme_data(post))
    
    logger.info(f"Found {len(memes)} valid meme posts")
    
    # Rank memes by lulzScore (descending)
    memes.sort(key=lambda x: x["data"]["lulzScore"], reverse=True)
    
    # Store in Firestore
    store_in_firestore(memes)
    
    summary = generate_ai_summary(memes)

    db.collection("status").document("sentiment_summary").set({
        "summary": summary,
        "updated_at": datetime.datetime.utcnow().isoformat()
    })

    print("\n🧠 AI Summary:", summary)
    
    logger.info("Meme scraping and storage complete")

if __name__ == "__main__":
    main() 
