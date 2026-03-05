# Chronicles of the Forgotten Realm

An AI-powered interactive fantasy RPG that runs in the browser. Inspired by tabletop adventures like Dungeons & Dragons, the game is presented as a real-time chat conversation between characters — you control one, the AI controls the rest.

## Features

- **4 playable characters** — Liora, Brom, Tharos, Mira, each with a distinct personality and role
- **AI companions** — the 3 characters you don't pick react, argue, advise, and interact with each other autonomously
- **Dungeon Master** — narrates the world with vivid, sensory descriptions; introduces creatures, dangers, and mysteries
- **Dynamic stories** — every session starts differently: varied locations, threats, moods, and antagonists
- **Narrative combat** — turn-based battles with real consequences, no dice rolls or stats
- **Character images** — drop your own artwork into `frontend/public/characters/` and they appear automatically
- **Dark fantasy UI** — Cinzel and Crimson Text fonts, dark theme with character color coding

## Tech Stack

- [Python](https://www.python.org/) + [FastAPI](https://fastapi.tiangolo.com/) — backend API
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/) — frontend
- [Groq](https://groq.com/) — free LLM inference (Llama 4 Maverick)
- [Railway](https://railway.app/) — backend deployment
- [Vercel](https://vercel.com/) — frontend deployment

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ChristinaMakri/chronicles-rpg.git
cd chronicles-rpg
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct
```

Get a free API key at [console.groq.com](https://console.groq.com).

Start the backend:

```bash
uvicorn main:app --reload
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Adding Character Images

Place your images in `frontend/public/characters/`:

```
frontend/public/characters/
  liora.png
  brom.png
  tharos.png
  mira.png
  dungeon-master.png
```

Supported formats: `.png`, `.jpg`, `.webp`. Until images are added, styled initials are shown as placeholders.

## Deployment

**Backend → Railway**

1. Connect your GitHub repo on [railway.app](https://railway.app)
2. Set root directory to `backend`
3. Add environment variables: `GROQ_API_KEY`, `GROQ_MODEL`
4. Railway uses `railway.toml` to start the server automatically

**Frontend → Vercel**

1. Import the repo on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-railway-backend-url`
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
4. Type your action and press Enter
5. The world responds — and the story continues


<img width="624" height="685" alt="image" src="https://github.com/user-attachments/assets/62d8ffd0-d880-4bdd-86ea-a1866109fe7b" />


<img width="536" height="623" alt="image" src="https://github.com/user-attachments/assets/868a7b2c-0cb1-49b1-bc27-e89b36c627f5" />


## License

MIT
