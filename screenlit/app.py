import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .server import router, set_message_handler, broadcast_message
from .types import Message
from typing import Callable
import asyncio

class ScreenlitApp:
    def __init__(self):
        self.app = FastAPI()
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_methods=["*"],
            allow_headers=["*"],
        )
        self.app.include_router(router)

    def on_chat_message(self, func: Callable):
        set_message_handler(func)
        return func

    async def send_message(self, content: str, role: str = "ai"):
        msg = Message(role=role, content=content)
        await broadcast_message(msg)

    def run(self, host="0.0.0.0", port=8000):
        # We need to run uvicorn.
        # Since this is a library, users call `sl.run()`.
        uvicorn.run(self.app, host=host, port=port)
