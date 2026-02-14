# voicevox-playground

**A web application that interacts with a VOICEVOX local server to convert text to speech and play it.**

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
  <a href="https://deepwiki.com/cat2151/voicevox-playground"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

## Features

- Reads aloud any text with Zundamon's voice
    - You can also select voices of other characters

## Server Setup

To use this application, you need to start the VOICEVOX local server.

1. Download and install [VOICEVOX](https://voicevox.hiroshiba.jp/)
2. Start the VOICEVOX engine (an HTTP server will start on port 50021). If accessing from the [GitHub Pages version](https://cat2151.github.io/voicevox-playground), use the following command to enable CORS:

   ```bash
   <your VOICEVOX directory>/vv-engine/run --cors_policy_mode all --allow_origin https://cat2151.github.io
   ```

   When developing, if you also want to use it from the local development server (`http://localhost:5173` provided by `npm run dev`), append `http://localhost:5173` to the above command.

   ```bash
   <your VOICEVOX directory>/vv-engine/run --cors_policy_mode all --allow_origin https://cat2151.github.io http://localhost:5173
   ```

## Usage

1. Start VOICEVOX (as mentioned above)
2. Open the [application](https://cat2151.github.io/voicevox-playground) in your browser
3. Enter the text you want to be read aloud into the text area
4. The audio will be played
5. You can edit the intonation

## How It Works
- The webpage is deployed to GitHub Pages
- From the webpage:
  - Requests are sent to the VOICEVOX local HTTP server (port 50021) to retrieve audio data in response.
  - Audio playback uses Tone.js v15.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Technology Stack

- TypeScript
- Vite
- Tone.js v15
- VOICEVOX API

※Note: The English `README.md` is automatically generated from `README.ja.md` via Gemini translation using GitHub Actions.