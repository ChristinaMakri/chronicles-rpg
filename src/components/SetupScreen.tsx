"use client";

import { useState } from "react";
import Image from "next/image";
import { CharacterName, CHARACTER_IMAGES } from "@/lib/types";
import { GameConfig } from "@/app/page";

interface Props {
  onStart: (config: GameConfig) => void;
}

const characters: {
  name: CharacterName;
  race: string;
  role: string;
  description: string;
  color: string;
}[] = [
  {
    name: "Liora",
    race: "Fairy / Nature Spirit",
    role: "The Heart",
    description: "Enthusiastic and optimistic, she sees beauty and magic in everything. Young for her kind, full of wonder — and sometimes dangerously naive.",
    color: "var(--color-liora)",
  },
  {
    name: "Brom",
    race: "Dwarf",
    role: "The Sage",
    description: "Ancient, wise, and unhurried. He has seen empires rise and crumble. His caution is not cowardice — it is hard-earned knowledge.",
    color: "var(--color-brom)",
  },
  {
    name: "Tharos",
    race: "Centaur",
    role: "The Warrior",
    description: "Proud, fast, and fearless. He values action over deliberation and strength over all else. Patience is a concept he tolerates in others.",
    color: "var(--color-tharos)",
  },
  {
    name: "Mira",
    race: "Human — Rogue",
    role: "The Shadow",
    description: "Brilliant and secretive. She carries a curse she studies like a wound she refuses to close. She knows more than she says, always.",
    color: "var(--color-mira)",
  },
];

export default function SetupScreen({ onStart }: Props) {
  const [character, setCharacter] = useState<CharacterName | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  function handleStart() {
    if (!character) return;
    onStart({ playerCharacter: character });
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      background: "radial-gradient(ellipse at 50% 0%, #1a0f2e 0%, #07070f 60%)",
    }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "clamp(22px, 4vw, 40px)",
          fontWeight: 700,
          color: "var(--gold)",
          letterSpacing: "3px",
          textShadow: "0 0 40px rgba(201,168,76,0.4)",
          marginBottom: "12px",
        }}>
          Chronicles of the Forgotten Realm
        </h1>
        <p style={{
          fontFamily: "var(--font-crimson)",
          fontStyle: "italic",
          fontSize: "20px",
          color: "var(--text-dim)",
          letterSpacing: "1px",
        }}>
          A world of mystery awaits. Choose your character.
        </p>
      </div>

      {/* Character Selection */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px",
        width: "100%",
        maxWidth: "800px",
        marginBottom: "40px",
      }}>
        {characters.map((c) => {
          const selected = character === c.name;
          const imgSrc = CHARACTER_IMAGES[c.name];
          const hasImgError = imgErrors[c.name];

          return (
            <button
              key={c.name}
              onClick={() => setCharacter(c.name)}
              style={{
                background: selected ? `rgba(${colorRgb(c.name)}, 0.08)` : "var(--bg-card)",
                border: `1px solid ${selected ? c.color : "var(--border)"}`,
                borderRadius: "8px",
                padding: "0",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: selected ? `0 0 24px rgba(${colorRgb(c.name)}, 0.2)` : "none",
                overflow: "hidden",
              }}
            >
              {/* Character image */}
              <div style={{
                width: "100%",
                height: "220px",
                position: "relative",
                background: `linear-gradient(135deg, rgba(${colorRgb(c.name)},0.08), var(--bg-deep))`,
                overflow: "hidden",
              }}>
                {!hasImgError ? (
                  <Image
                    src={imgSrc}
                    alt={c.name}
                    fill
                    style={{ objectFit: "cover", objectPosition: "top" }}
                    onError={() => setImgErrors((prev) => ({ ...prev, [c.name]: true }))}
                  />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexDirection: "column", gap: "8px",
                  }}>
                    <div style={{
                      width: "80px", height: "80px", borderRadius: "50%",
                      background: `rgba(${colorRgb(c.name)}, 0.12)`,
                      border: `2px solid ${c.color}`,
                      boxShadow: `0 0 24px rgba(${colorRgb(c.name)}, 0.3)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-cinzel)", fontSize: "36px",
                      fontWeight: 700, color: c.color,
                    }}>
                      {c.name[0]}
                    </div>
                  </div>
                )}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
                  background: `linear-gradient(to top, ${selected ? `rgba(${colorRgb(c.name)},0.15)` : "var(--bg-card)"}, transparent)`,
                }} />
              </div>

              {/* Text */}
              <div style={{ padding: "16px 20px 20px" }}>
                <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "18px", fontWeight: 700, color: c.color, marginBottom: "4px" }}>
                  {c.name}
                </div>
                <div style={{ fontSize: "11px", fontFamily: "var(--font-cinzel)", letterSpacing: "2px", color: "var(--text-dim)", marginBottom: "10px" }}>
                  {c.race} · {c.role}
                </div>
                <div style={{ fontFamily: "var(--font-crimson)", fontStyle: "italic", fontSize: "16px", color: "var(--text-primary)", lineHeight: "1.5" }}>
                  {c.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleStart}
        disabled={!character}
        style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "14px",
          letterSpacing: "3px",
          padding: "16px 48px",
          background: character ? "rgba(201,168,76,0.15)" : "transparent",
          border: `1px solid ${character ? "var(--gold)" : "var(--border)"}`,
          borderRadius: "4px",
          color: character ? "var(--gold)" : "var(--text-dim)",
          cursor: character ? "pointer" : "not-allowed",
          transition: "all 0.2s",
          textTransform: "uppercase",
        }}
      >
        Begin the Adventure
      </button>
    </div>
  );
}

function colorRgb(name: string): string {
  const map: Record<string, string> = {
    Liora: "34,211,238",
    Brom: "245,158,11",
    Tharos: "248,113,113",
    Mira: "74,222,128",
  };
  return map[name] ?? "255,255,255";
}
