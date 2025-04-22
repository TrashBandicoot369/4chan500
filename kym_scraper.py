#!/usr/bin/env python3

"""
Know Your Meme Trending Scraper – Updated to use Playwright for JavaScript rendering
Scrapes https://knowyourmeme.com/photos/trending and pushes to Firestore.
"""

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import random
import time
from typing import List, Dict
from firebase_admin_setup import db

def scrape_trending_photos() -> List[Dict]:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # Use visible browser for debugging
        page = browser.new_page()
        
        print("Loading page...")
        try:
            # Navigate to the page
            page.goto("https://knowyourmeme.com/photos/trending", timeout=60000)
            
            # Wait for any content to load
            page.wait_for_load_state("domcontentloaded")
            print("Initial page loaded")
            
            # Wait a bit for JavaScript to execute
            page.wait_for_timeout(5000)
            
            # Scroll down several times to load lazy content
            print("Scrolling to load lazy content...")
            for i in range(5):
                # JavaScript scroll command
                page.evaluate("window.scrollBy(0, 1000)")
                # Wait between scrolls
                page.wait_for_timeout(1000)
                print(f"Scroll {i+1}/5 complete")
            
            # Final wait for all content to settle
            print("Waiting for final content to load...")
            page.wait_for_timeout(3000)
            
            # Get the HTML content
            html = page.content()
            print("Captured page content")
            
            # Take a screenshot for debugging
            page.screenshot(path="kym_debug.png")
            print("Saved screenshot to kym_debug.png")
            
        except Exception as e:
            print(f"Error during page loading: {e}")
            # Take error screenshot
            try:
                page.screenshot(path="kym_error.png")
                print("Error screenshot saved to kym_error.png")
            except:
                pass
            browser.close()
            return []
        
        browser.close()

    # Parse with BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")
    
    # Try different selectors that might contain images
    image_entries = []
    
    # Try various possible selectors for images
    possible_selectors = [
        "a.photo", 
        "div.photo", 
        "div.media-item-wrapper",
        "img[src*='i.kym-cdn.com']",  # Any image from the KYM CDN
        "a[href*='/photos/']"         # Any link to photos
    ]
    
    for selector in possible_selectors:
        entries = soup.select(selector)
        if entries:
            print(f"✅ Found {len(entries)} entries with selector: {selector}")
            image_entries = entries
            break
    
    if not image_entries:
        # Last resort: just get all images that might be from KYM
        all_images = soup.find_all("img")
        image_entries = [img for img in all_images if img.get("src") and ("kym-cdn" in img.get("src") or "knowyourmeme" in img.get("src"))]
        print(f"✅ Last resort: found {len(image_entries)} KYM-related images")

    results = []

    for entry in image_entries[:20]:  # Limit to 20 items for now
        try:
            # Handle different entry types
            if entry.name == "img":
                # Direct image element
                image_url = entry.get("src")
                name = entry.get("alt", "Untitled Meme")
                link = entry.parent.get("href", "") if entry.parent and entry.parent.name == "a" else ""
                if link and not link.startswith("http"):
                    link = "https://knowyourmeme.com" + link
            else:
                # Container element (a, div, etc.)
                # Look for image inside
                img = entry.find("img")
                link = entry.get("href", "") if entry.name == "a" else ""
                if link and not link.startswith("http"):
                    link = "https://knowyourmeme.com" + link
                
                if img:
                    image_url = img.get("src")
                    name = img.get("alt", "Untitled Meme")
                else:
                    # Skip entries without images
                    continue

            # Make sure we have an image URL
            if not image_url:
                continue
                
            # Ensure image URL is absolute
            if image_url.startswith("//"):
                image_url = "https:" + image_url
                
            # Create a unique ticker based on available text
            ticker_base = (name or "MEME").upper().replace(" ", "_")
            ticker = ticker_base[:8]
                
            result = {
                "name": name or "Untitled Meme",
                "link": link or "https://knowyourmeme.com/photos/trending",
                "image_url": image_url,
                "ticker": ticker,
                "price": round(random.uniform(0.5, 5.0), 2),
                "percentChange": round(random.uniform(-20, 20), 2),
                "volume": random.randint(10000, 1000000),
            }
            
            results.append(result)
            print(f"✅ Added: {result['name']} (Image: {image_url[:50]}...)")
            
        except Exception as e:
            print(f"❌ Error processing entry: {e}")
            continue

    print(f"\nExtracted {len(results)} memes.")
    return results

def push_to_firestore(memes: List[Dict]):
    print("\n📤 Pushing to Firestore...")
    ref = db.collection("memes")
    for meme in memes:
        doc_id = meme["name"].lower().replace(" ", "-")
        ref.document(doc_id).set(meme)
    print("✅ Done.")

if __name__ == "__main__":
    memes = scrape_trending_photos()
    if memes:
        push_to_firestore(memes)
