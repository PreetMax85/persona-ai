# Persona AI

Chat with AI versions of **Hitesh Choudhary** and **Piyush Garg** in their authentic teaching style. Built with vanilla HTML/CSS/JS, powered by Google Gemini 2.5 Flash.

## Features

- Two AI personas — Hitesh Sir (career + coding mentor) and Piyush Sir (builder + project mentor)
- Switch between personas anytime
- Context-aware conversation (remembers last 20 messages)
- Streaming responses with a human-like typewriter effect
- Misuse detection — prompt injection and jailbreak attempts get a playful roast instead of compliance
- Clean dark UI, responsive, no framework

## Tech Stack

| Layer | What |
|---|---|
| Frontend | HTML, CSS, JavaScript (vanilla, no framework) |
| AI | Google Gemini 2.5 Flash via OpenAI SDK |
| Deployment | Vercel (static + serverless function) |

## How the Personas Were Built

1. Transcripts were pulled from Hitesh's and Piyush's YouTube livestreams.
2. Each transcript was analyzed for speaking style, teaching patterns, catchphrases, Hindi/English ratio, and recurring opinions.
3. That analysis became the reference for writing the system prompts in `api/constant/system_prompt.js`.

## Project Structure

```
persona-ai/
├── api/
│   ├── constant/
│   │   └── system_prompt.js    # Persona system prompts
│   └── chat.js                 # Gemini API handler (serverless)
├── public/
│   ├── css/
│   │   └── chat.css            # Linear-style dark theme
│   ├── images/
│   │   ├── hitesh-sir.jpg
│   │   └── piyush-sir.jpg
│   ├── js/
│   │   └── script.js           # Chat UI logic, streaming, switching
│   └── index.html              # Single-page chat app
├── .env                        # GEMINI_API_KEY goes here
├── .env.example
├── dev-server.js               # Local dev server (serves public/ + API)
├── vercel.json                 # Vercel deployment config
├── package.json
└── readme.md
```

## Getting Started

```bash
# Clone
git clone https://github.com/PreetMax85/persona-ai.git
cd persona-ai

# Install dev dependencies
npm install

# Create .env with your Gemini API key
cp .env.example .env
# Edit .env: GEMINI_API_KEY=your_key_here

# Start dev server
npm run dev
```

Open `http://localhost:3000`.

## Context Management

- Conversation memory is a `history[]` array in the frontend JS, sent with every request (last 20 messages).
- Personas are persisted in `localStorage`. Switching personas reloads the page to start a fresh session.
- No database. State is ephemeral beyond what the client sends.
- If the user goes quiet for 45–90 seconds after a reply, the mentor sends a natural follow-up (once per exchange).

## Deployment

Push to GitHub, connect the repo to Vercel. The `vercel.json` handles serving static files from `public/` and routing `/api/chat` to the serverless function. Make sure `GEMINI_API_KEY` is set in Vercel's environment variables.
