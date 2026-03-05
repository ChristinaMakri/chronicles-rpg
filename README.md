# Chronicles of the Forgotten Realm

An AI-powered interactive fantasy RPG that runs in the browser. Inspired by tabletop adventures like Dungeons & Dragons, the game is presented as a real-time chat conversation between characters — you control one, the AI controls the rest.

## Features

- **4 playable characters** — Liora, Brom, Tharos, Mira, each with a distinct personality and role
- **AI companions** — the 3 characters you don't pick react, argue, advise, and interact with each other autonomously
- **Dungeon Master** — narrates the world with vivid, sensory descriptions; introduces creatures, dangers, and mysteries
- **Dynamic stories** — every session starts differently: varied locations, threats, moods, and antagonists
- **Narrative combat** — turn-based battles with real consequences, no dice rolls or stats
- **Character images** — drop your own artwork into `public/characters/` and they appear automatically
- **Dark fantasy UI** — Cinzel and Crimson Text fonts, dark theme with character color coding

## Tech Stack

- [Next.js 15](https://nextjs.org/) — frontend + API routes
- [Groq](https://groq.com/) — free LLM inference (Llama 4 Maverick)
- [Vercel](https://vercel.com/) — deployment (free tier)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fantasy-rpg.git
cd fantasy-rpg
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct
```

Get a free API key at [console.groq.com](https://console.groq.com).

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Character Images

Place your images in the `public/characters/` directory:

```
public/
  characters/
    liora.png
    brom.png
    tharos.png
    mira.png
    dungeon-master.png
```

Supported formats: `.png`, `.jpg`, `.webp`. Until images are added, styled initials are shown as placeholders.

## Deployment on Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables in the Vercel project settings:
   - `GROQ_API_KEY`
   - `GROQ_MODEL`
4. Deploy

## Characters

| Character | Race | Role |
|---|---|---|
| **Liora** | Fairy / Nature Spirit | The Heart — enthusiastic, optimistic, naive |
| **Brom** | Dwarf | The Sage — wise, cautious, deeply experienced |
| **Tharos** | Centaur | The Warrior — proud, aggressive, action-driven |
| **Mira** | Human / Rogue | The Shadow — intelligent, sarcastic, cursed |

## How to Play

1. Select your character
2. The Dungeon Master opens the scene
3. Your companions react in character
4. A prompt asks what **you** want to do
5. Type your action and press Enter
6. The world responds — and the story continues


<img width="624" height="685" alt="image" src="https://github.com/user-attachments/assets/62d8ffd0-d880-4bdd-86ea-a1866109fe7b" />


## License

MIT
