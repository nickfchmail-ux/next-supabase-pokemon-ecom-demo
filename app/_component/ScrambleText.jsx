"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/`~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function ScrambleText({
  words = "Find Your Partner",
  color = "#9CA3AF",
  fontSize = 12,
  fontWeight = 600,
  letterSpacing = "0.15em",
  textAlign = "center",
  enterDuration = 1.5,
  enterScrambleIntensity = 40,
  style,
}) {
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const hasPlayedRef = useRef(false);
  const containerRef = useRef(null);

  const scramble = useCallback(() => {
    const target = words;
    if (!target) return;

    const totalSteps = target.length * 3;
    const stepTime = (enterDuration * 1000) / totalSteps;

    let current = "";
    let charIndex = 0;
    let framesSinceNewChar = 0;

    const interval = setInterval(() => {
      framesSinceNewChar++;

      if (charIndex < target.length) {
        current = "";
        // Show already revealed characters
        for (let i = 0; i < charIndex; i++) {
          current += target[i];
        }
        // Add glitch characters for the current position
        for (let i = charIndex; i < target.length; i++) {
          if (target[i] === " ") {
            current += " ";
          } else if (i === charIndex) {
            current += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          } else {
            current += "█";
          }
        }
        setDisplayText(current);

        // Reveal next character after a few glitch frames
        if (framesSinceNewChar >= 3) {
          framesSinceNewChar = 0;
          charIndex++;
          // Immediately show revealed text
          let revealed = "";
          for (let i = 0; i < charIndex; i++) revealed += target[i];
          for (let i = charIndex; i < target.length; i++) revealed += i === charIndex ? target[i] : "█";
          setDisplayText(revealed);
        }
      } else {
        setIsDone(true);
        setDisplayText(target);
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [words, enterDuration, enterScrambleIntensity]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          const cleanup = scramble();
          return cleanup;
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [scramble]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        textAlign,
        fontFamily: "inherit",
        fontWeight,
        fontSize: `${fontSize}px`,
        letterSpacing,
        color,
        lineHeight: "1em",
        minWidth: "1ch",
        ...style,
      }}
    >
      {displayText || words}
    </div>
  );
}
