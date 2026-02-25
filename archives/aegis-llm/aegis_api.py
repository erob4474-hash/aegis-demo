import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from aegis_core import AegisCore

app = FastAPI()
core = AegisCore()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class ChatRequest(BaseModel):
    prompt: str
    username: str

@app.post("/v1/secure-chat")
async def secure_chat(req: ChatRequest):
    masked = core.anonymize(req.prompt, "session_demo")
    return {"status": "success", "debug_masked": masked}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)