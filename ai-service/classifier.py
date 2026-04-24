import os
import time
from dotenv import load_dotenv

load_dotenv()

USE_MOCK = os.getenv("USE_MOCK", "false").lower() == "true"

def classify_emergency(text: str, location: str = "", room_number: str = "") -> dict:

    if USE_MOCK:
        time.sleep(0.5)
        text_lower = text.lower()

        if any(w in text_lower for w in ["fire", "smoke", "burning", "flame"]):
            return {
                "type": "FIRE",
                "severity": "CRITICAL",
                "assign_to": "fire_brigade",
                "summary": f"Fire emergency reported in room {room_number} at {location}",
                "actions": ["Evacuate the floor immediately", "Call fire brigade", "Alert all security staff"],
                "call_911": True,
                "confidence": "HIGH"
            }
        elif any(w in text_lower for w in ["heart", "breathe", "pain", "faint", "blood", "hurt", "fall"]):
            return {
                "type": "MEDICAL",
                "severity": "HIGH",
                "assign_to": "nurse",
                "summary": f"Medical emergency reported in room {room_number}",
                "actions": ["Send nurse immediately", "Call ambulance", "Keep guest calm"],
                "call_911": True,
                "confidence": "HIGH"
            }
        elif any(w in text_lower for w in ["steal", "fight", "weapon", "threat", "robbery", "attack"]):
            return {
                "type": "SECURITY",
                "severity": "HIGH",
                "assign_to": "security",
                "summary": f"Security threat reported at {location}",
                "actions": ["Dispatch security team", "Lock down area", "Call police"],
                "call_911": True,
                "confidence": "HIGH"
            }
        elif any(w in text_lower for w in ["flood", "water", "leak", "pipe"]):
            return {
                "type": "FLOOD",
                "severity": "MEDIUM",
                "assign_to": "manager",
                "summary": f"Water/flood issue reported in room {room_number}",
                "actions": ["Send maintenance team", "Shut off water supply", "Move guest to another room"],
                "call_911": False,
                "confidence": "HIGH"
            }
        else:
            return {
                "type": "OTHER",
                "severity": "LOW",
                "assign_to": "manager",
                "summary": f"General emergency reported: {text[:60]}",
                "actions": ["Send manager to assess", "Document the incident", "Follow up with guest"],
                "call_911": False,
                "confidence": "MEDIUM"
            }

    # real Gemini call (used when USE_MOCK=false)
    from google import genai
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    prompt = f"""
    You are an emergency response AI for a hospitality venue.
    Analyze this emergency and return ONLY valid JSON.
    Message: "{text}"
    Location: "{location}"
    Room: "{room_number}"
    Return ONLY this JSON:
    {{
        "type": "FIRE or MEDICAL or SECURITY or FLOOD or OTHER",
        "severity": "LOW or MEDIUM or HIGH or CRITICAL",
        "assign_to": "security or nurse or manager or fire_brigade or police",
        "summary": "one sentence summary",
        "actions": ["action 1", "action 2", "action 3"],
        "call_911": true or false,
        "confidence": "HIGH or MEDIUM or LOW"
    }}
    """
    response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
    raw = response.text.strip().replace("```json", "").replace("```", "").strip()
    return __import__('json').loads(raw)