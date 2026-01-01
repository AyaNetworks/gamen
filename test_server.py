import threading
import time
import requests
import screenlit as sl
from screenlit.types import Message
import asyncio

# Define a simple handler
@sl.on_chat_message
async def handle_message(msg: Message):
    print(f"Received message: {msg.content}")
    # Echo back
    await sl.send_message(f"Echo: {msg.content}")

def test_server():
    # Run server in a separate thread
    thread = threading.Thread(target=sl.run, kwargs={"port": 8001}, daemon=True)
    thread.start()

    time.sleep(2) # Wait for startup

    # Test API
    try:
        response = requests.post(
            "http://localhost:8001/api/chat/message",
            json={"role": "user", "content": "Hello World"}
        )
        assert response.status_code == 200
        print("Test Passed: Server is running and responding.")
    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    test_server()
