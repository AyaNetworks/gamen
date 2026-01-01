import unittest
import threading
import time
import requests
import screenlit as sl
from screenlit.types import Message
import asyncio
import uvicorn
import os

# Ensure we don't have port conflicts
PORT = 8002

class TestScreenlitBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # We need to start the server in a separate thread
        cls.server_thread = threading.Thread(target=sl.run, kwargs={"port": PORT}, daemon=True)
        cls.server_thread.start()
        time.sleep(2) # Give it time to start

    def test_message_flow(self):
        # Define a handler (though we can't easily check side effects inside the test class without global state or a queue)
        # But we can check if the API returns 200
        response = requests.post(
            f"http://localhost:{PORT}/api/chat/message",
            json={"role": "user", "content": "Test Message"}
        )
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()
