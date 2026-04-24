from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from classifier import classify_emergency

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmergencyRequest(BaseModel):
    message: str
    location: str = ""
    room_number: str = ""

@app.post("/analyze")
async def analyze(data: EmergencyRequest):
    try:
        result = classify_emergency(
            data.message,
            data.location,
            data.room_number
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "AI service running!"}