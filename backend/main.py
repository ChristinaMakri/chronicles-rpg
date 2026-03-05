import json
import re
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from prompt import build_system_prompt

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)
MODEL = os.getenv("GROQ_MODEL", "meta-llama/llama-4-maverick-17b-128e-instruct")


class Turn(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class GameRequest(BaseModel):
    playerCharacter: str
    history: list[Turn]
    playerMessage: str | None = None


def sanitize_messages(messages: list[dict]) -> list[dict]:
    character_names = ["DM", "Liora", "Brom", "Tharos", "Mira"]
    for m in messages:
        for name in character_names:
            m["text"] = re.sub(rf"^{re.escape(name)}[:\s\n]+", "", m["text"], flags=re.IGNORECASE)
    return messages


def parse_game_messages(raw: str) -> list[dict]:
    # Strip markdown code fences if present
    raw = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("`").strip()
    # Find first [ and last ]
    start = raw.find("[")
    end = raw.rfind("]")
    if start == -1 or end == -1:
        raise ValueError("No JSON array found in response")
    return json.loads(raw[start:end + 1])


@app.post("/api/game")
async def game_endpoint(req: GameRequest):
    system_prompt = build_system_prompt(req.playerCharacter)

    messages = [{"role": "system", "content": system_prompt}]

    for turn in req.history:
        messages.append({"role": turn.role, "content": turn.content})

    if req.playerMessage:
        messages.append({
            "role": "user",
            "content": f"{req.playerCharacter}: {req.playerMessage}"
        })

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.85,
            max_tokens=1200,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

    raw = response.choices[0].message.content or ""

    try:
        parsed = parse_game_messages(raw)
        parsed = sanitize_messages(parsed)
    except Exception:
        raise HTTPException(status_code=500, detail=f"Failed to parse LLM response: {raw[:300]}")

    return {"messages": parsed, "raw": raw}


# Serve React frontend in production
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.isdir(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        return FileResponse(os.path.join(frontend_dist, "index.html"))
