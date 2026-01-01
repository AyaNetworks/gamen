from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import asyncio
from typing import List, Callable, Optional, Dict
from .types import Message
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

_message_handler: Optional[Callable] = None
_active_connections: List[asyncio.Queue] = []

def set_message_handler(handler):
    global _message_handler
    _message_handler = handler

async def broadcast_message(message: Message):
    dead_queues = []
    for queue in _active_connections:
        try:
            await queue.put(message)
        except Exception:
            dead_queues.append(queue)

    for dq in dead_queues:
        if dq in _active_connections:
            _active_connections.remove(dq)

@router.post("/api/chat/message")
async def receive_message(message: Message):
    if _message_handler:
        if asyncio.iscoroutinefunction(_message_handler):
            await _message_handler(message)
        else:
            _message_handler(message)
    return {"status": "ok"}

@router.get("/api/chat/stream")
async def stream():
    queue = asyncio.Queue()
    _active_connections.append(queue)

    async def event_generator():
        try:
            while True:
                message = await queue.get()
                data = message.model_dump_json()
                yield f"data: {data}\n\n"
        except asyncio.CancelledError:
            if queue in _active_connections:
                _active_connections.remove(queue)
        except Exception as e:
            logger.error(f"Stream error: {e}")
            if queue in _active_connections:
                _active_connections.remove(queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
