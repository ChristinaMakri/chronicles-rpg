"use client";

import Image from "next/image";
import { useState } from "react";
import { GameMessage, MessageCharacter, CharacterName, CHARACTER_IMAGES } from "@/lib/types";

const CHARACTER_COLORS: Record<MessageCharacter, string> = {
  DungeonMaster: "var(--color-dm)",
  Liora: "var(--color-liora)",
  Brom: "var(--color-brom)",
  Tharos: "var(--color-tharos)",
  Mira: "var(--color-mira)",
  SYSTEM: "var(--color-system)",
};

const CHARACTER_LABELS: Record<MessageCharacter, string> = {
  DungeonMaster: "Dungeon Master",
  Liora: "Liora",
  Brom: "Brom",
  Tharos: "Tharos",
  Mira: "Mira",
  SYSTEM: "",
};

function colorRgb(character: string): string {
  const map: Record<string, string> = {
    Liora: "34,211,238",
    Brom: "245,158,11",
    Tharos: "248,113,113",
    Mira: "74,222,128",
    DungeonMaster: "181,123,238",
    SYSTEM: "148,163,184",
  };
  return map[character] ?? "255,255,255";
}

interface AvatarProps {
  character: MessageCharacter;
  size?: number;
}

function Avatar({ character, size = 40 }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = CHARACTER_IMAGES[character];
  const color = CHARACTER_COLORS[character];
  const label = CHARACTER_LABELS[character];
  const initial = label ? label[0] : "?";

  const showInitial = !imgSrc || imgError;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: `2px solid ${color}`,
    boxShadow: `0 0 8px rgba(${colorRgb(character)}, 0.35)`,
    flexShrink: 0,
    position: "relative" as const,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `rgba(${colorRgb(character)}, 0.12)`,
  };

  return (
    <div style={containerStyle}>
      {!showInitial && (
        <Image
          src={imgSrc}
          alt={label}
          fill
          style={{ objectFit: "cover", objectPosition: "top" }}
          onError={() => setImgError(true)}
        />
      )}
      {showInitial && (
        <span style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: size * 0.42,
          fontWeight: 700,
          color,
          lineHeight: 1,
          userSelect: "none",
        }}>
          {initial}
        </span>
      )}
    </div>
  );
}

interface Props {
  message: GameMessage;
  playerCharacter: CharacterName;
  isPlayer?: boolean;
}

export default function MessageBubble({ message, playerCharacter, isPlayer }: Props) {
  const { character, text } = message;
  const color = CHARACTER_COLORS[character];
  const label = isPlayer ? playerCharacter : CHARACTER_LABELS[character];

  // SYSTEM message — centered prompt
  if (character === "SYSTEM") {
    return (
      <div
        className="message-enter"
        style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}
      >
        <div
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "13px",
            letterSpacing: "1.5px",
            color: "var(--color-system)",
            textAlign: "center",
            maxWidth: "560px",
            padding: "10px 24px",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            background: "rgba(148,163,184,0.04)",
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  // DM message — full width with avatar
  if (character === "DungeonMaster") {
    return (
      <div
        className="message-enter"
        style={{
          padding: "20px 0 8px",
          borderTop: "1px solid var(--border)",
          marginTop: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <Avatar character="DungeonMaster" size={36} />
          <div
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color,
              opacity: 0.9,
            }}
          >
            ✦ Dungeon Master
          </div>
        </div>
        <p
          style={{
            fontFamily: "var(--font-crimson)",
            fontStyle: "italic",
            fontSize: "19px",
            lineHeight: "1.75",
            color: "var(--text-primary)",
            paddingLeft: "48px",
          }}
        >
          {text}
        </p>
      </div>
    );
  }

  // Player message — right aligned with avatar
  if (isPlayer) {
    return (
      <div
        className="message-enter"
        style={{ display: "flex", justifyContent: "flex-end", gap: "10px", padding: "6px 0", alignItems: "flex-start" }}
      >
        <div style={{ maxWidth: "72%" }}>
          <div
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color,
              textAlign: "right",
              marginBottom: "6px",
            }}
          >
            {label} — You
          </div>
          <div
            style={{
              background: `rgba(${colorRgb(character)}, 0.08)`,
              border: `1px solid rgba(${colorRgb(character)}, 0.3)`,
              borderRadius: "12px 12px 2px 12px",
              padding: "12px 18px",
              fontFamily: "var(--font-crimson)",
              fontSize: "18px",
              lineHeight: "1.6",
              color: "var(--text-primary)",
            }}
          >
            {text}
          </div>
        </div>
        <Avatar character={character} size={40} />
      </div>
    );
  }

  // Companion message — left aligned with avatar
  return (
    <div
      className="message-enter"
      style={{ display: "flex", gap: "10px", padding: "6px 0", alignItems: "flex-start" }}
    >
      <Avatar character={character} size={40} />
      <div style={{ maxWidth: "75%" }}>
        <div
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color,
            marginBottom: "6px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "2px 12px 12px 12px",
            padding: "12px 18px",
            fontFamily: "var(--font-crimson)",
            fontSize: "18px",
            lineHeight: "1.6",
            color: "var(--text-primary)",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
