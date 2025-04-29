import requests

# 🔥 Hardcode your Groq key for testing
GROQ_API_KEY = "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"

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}
data = {
    "model": "mixtral-8x7b-32768",
    "messages": [
        {"role": "user", "content": "Say something completely unhinged about memes"}
    ],
    "temperature": 1.2
}

response = requests.post(url, headers=headers, json=data)

print("Status Code:", response.status_code)
try:
    print("Response JSON:")
    print(response.json())
except Exception:
    print("Raw Response:")
    print(response.text)
