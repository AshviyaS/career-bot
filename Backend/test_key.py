import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
key = os.getenv("GEMINI_API_KEY")
print(f"Key loaded: {key[:5]}...") # Should print the first 5 chars

genai.configure(api_key=key)
model = genai.GenerativeModel('gemini-1.5-flash')
try:
    response = model.generate_content("Say hello")
    print(f"Success: {response.text}")
except Exception as e:
    print(f"Still failing: {e}")