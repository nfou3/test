import re
import requests

# URL of the target site
TARGET_URL = "https://www.livehdtv.com/ard"

# Spoof user-agent to prevent getting blocked by the host
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Referer": "https://www.google.com/"
}

def extract_and_update():
    try:
        print(f"Fetching {TARGET_URL}...")
        response = requests.get(TARGET_URL, headers=HEADERS, timeout=15)
        response.raise_for_status()
        
        # Search the page source for any HTTP/HTTPS links ending in .m3u8
        # (This catches links inside script tags, iframe targets, or source video tags)
        m3u8_pattern = r'(https?://[^\s"\'<>]+?\.m3u8[^\s"\'<>]*)'
        matches = re.findall(m3u8_pattern, response.text)
        
        if not matches:
            print("Error: No .m3u8 stream link found on the page.")
            return

        # Get the first matching stream link
        stream_link = matches[0]
        print(f"Extracted stream link: {stream_link}")
        
        # Format the content into a standard M3U8 structure
        m3u_content = f"#EXTM3U\n#EXTINF:-1,ARD\n{stream_link}\n"
        
        # Save to file
        with open("ard.m3u8", "w", encoding="utf-8") as f:
            f.write(m3u_content)
        print("ard.m3u8 file updated successfully.")
        
    except Exception as e:
        print(f"An error occurred during extraction: {e}")

if __name__ == "__main__":
    extract_and_update()
