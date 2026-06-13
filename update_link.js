const fs = require('fs');

// URL of the target site
const TARGET_URL = "https://www.livehdtv.com/ard";

// Spoof user-agent to prevent getting blocked by the host
const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Referer": "https://www.google.com/"
};

async function extractAndUpdate() {
    try {
        console.log(`Fetching ${TARGET_URL}...`);
        
        const response = await fetch(TARGET_URL, { headers: HEADERS });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Search the page source for any HTTP/HTTPS links ending in .m3u8
        const m3u8Pattern = /(https?:\/\/[^\s"'<>]+?\.m3u8[^\s"'<>]*)/g;
        const matches = html.match(m3u8Pattern);
        
        if (!matches || matches.length === 0) {
            console.error("Error: No .m3u8 stream link found on the page.");
            return;
        }

        // Get the first matching stream link
        const streamLink = matches[0];
        console.log(`Extracted stream link: ${streamLink}`);
        
        // Format the content into a standard M3U8 structure
        const m3uContent = `#EXTM3U\n#EXTINF:-1,ARD\n${streamLink}\n`;
        
        // Save to file synchronously
        fs.writeFileSync("ard.m3u8", m3uContent, "utf-8");
        console.log("ard.m3u8 file updated successfully.");
        
    } catch (error) {
        console.error(`An error occurred during extraction: ${error.message}`);
    }
}

extractAndUpdate();
