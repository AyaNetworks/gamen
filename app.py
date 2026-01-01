import screenlit as sl
from screenlit.types import Message
import asyncio

@sl.on_chat_message
async def on_message(msg: Message):
    print(f"User said: {msg.content}")
    # Simulate thinking
    await asyncio.sleep(0.5)
    await sl.send_message(f"I heard you say: {msg.content}")

if __name__ == "__main__":
    print("Starting Screenlit app on port 8000...")
    sl.run(port=8000)
