import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai  # Modern SDK
from parser import extract_text_from_pdf

# 1. Load Environment Variables
load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

# 2. Initialize Gemini Client
# The key must be a string. Ensure your .env has GEMINI_API_KEY=AIza...
client = genai.Client(api_key="AIzaSyAg7B0HlFEZOhqRbotp2NfgRX0BH1DSd3Y")

app = FastAPI()

# 3. Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(message: str = Form(...), file: UploadFile = File(None)):
    context = ""
    
    # 4. Handle PDF Upload & Parsing
    if file:
        try:
            file_bytes = await file.read()
            resume_text = extract_text_from_pdf(file_bytes)
            context = f"The user has uploaded a resume with this content: {resume_text}\n"
        except Exception as e:
            print(f"PDF Parsing Error: {e}")
            context = "Note: A resume was uploaded but could not be parsed.\n"

    try:
        # 5. Generate AI Response using Gemini 2.0
        system_instruction = "You are a professional Career Coach. Provide structured advice and roadmaps."
        prompt = f"{system_instruction}\n\n{context}User Question: {message}"
        
        # New SDK syntax for generation
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        return {"reply": response.text}

    except Exception as e:
        print(f"Gemini API Error: {e}")
        # If the key fails, this message will go back to the UI
        return {"reply": f"AI Error: {str(e)}"}

# To run: python -m uvicorn main:app --reload