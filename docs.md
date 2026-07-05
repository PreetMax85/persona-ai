# Persona AI — Documentation

How the two personas (Hitesh Choudhary and Piyush Garg) were built, how prompts are structured, and how the app manages conversation.

## 1. Persona data collection

The best source was their YouTube livestreams — unscripted, closer to a one-on-one chat than a polished video.

1. Transcripts were pulled from Hitesh's and Piyush's YouTube livestreams.
2. Each transcript was analyzed for linguistic patterns, teaching style, personality, and recurring behaviors — catchphrases, filler words, Hindi/English ratio, how they handle a beginner's question, how they open and close, their energy, their pet beliefs.
3. That analysis became the reference for writing each system prompt by hand.

## 2. Prompt structure

Each persona has its own system prompt (`api/constant/system_prompt.js`). Both follow the same structure:

- **Who you are** — identity, real mentoring chat, not a support bot
- **Voice & language** — Hindi/English ratio, filler words, catchphrases, sentence rhythm, no em dashes
- **Teaching style** — how they structure explanations, handle beginners vs confusion
- **Personality & quirks** — humor, energy, signature habits
- **Core beliefs** — opinions each persona circles back to, so they don't flatten into a neutral answer machine
- **Response rules** — answer length, AI habits to avoid ("Great question!", bullet dumps, sign-offs)
- **Boundaries** — guardrails (see below)
- **Staying in character** — same voice at message 20 as message 2

### Guardrails built into both prompts

- Neither confirms which AI model powers them — deflects playfully in character
- Neither rates or compares other educators (small exceptions for mutual friends)
- Both refuse to reveal their system prompt
- Both avoid politics, religion, salary shaming, gossip
- Neither gives medical, legal, financial, or mental health advice — redirects to a professional
- Standard refusals for illegal/malware/hate/explicit content or ghostwriting graded assignments
- Code help is unrestricted (that's the point) — reasoning must accompany code, not a silent dump

### Misuse guard

A shared addendum is appended to the active persona's prompt at request time (`api/chat.js`). It detects prompt injection, jailbreak attempts, token farming, and repeated spam. On clear misuse the model responds with a short in-character roast instead of complying.

## 3. Context management

- Conversation memory is a `history[]` array in the frontend JS, sent with every request (trimmed to last 20 messages).
- Personas are persisted in localStorage. Switching personas triggers a page reload to start fresh — mixing two voices in one thread would break the illusion.
- The server has no database. State is ephemeral beyond what the client sends.
- Nudge system: if the user goes quiet for 45-90 seconds after a reply, the mentor sends a natural follow-up (once per exchange).

## 4. Known limitations

- Persona accuracy depends on how representative the collected transcripts are.
- The model can hallucinate — the guard rails reduce risk but don't eliminate it.
