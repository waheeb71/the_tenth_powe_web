import aiohttp
import os

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
OWNER_ID = os.getenv("OWNER_ID")

async def send_telegram_notification(message: str):
    """
    Sends a message to the owner via Telegram Bot API using simple HTTP request.
    Non-blocking and lightweight for the API server.
    """
    if not TELEGRAM_BOT_TOKEN or not OWNER_ID:
        print("Warning: Telegram Token or Owner ID not set. Notification skipped.")
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": OWNER_ID,
        "text": message,
        "parse_mode": "HTML"
    }

    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(url, json=payload) as response:
                if response.status == 200:
                    print("Telegram notification sent successfully.")
                else:
                    error_text = await response.text()
                    print(f"Failed to send Telegram notification. Status: {response.status}, Response: {error_text}")
        except Exception as e:
            print(f"Error sending Telegram notification: {e}")
