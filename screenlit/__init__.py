from .app import ScreenlitApp
from .server import broadcast_message
from .types import Message

_app_instance = ScreenlitApp()

# Expose the singleton instance methods
on_chat_message = _app_instance.on_chat_message
run = _app_instance.run

# Helper for sending messages from user code
async def send_message(content: str, role: str = "ai"):
    msg = Message(role=role, content=content)
    await broadcast_message(msg)
