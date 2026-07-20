"use client";

import { useState, useEffect, useRef } from "react";

export default function StreamingChatResponse({ text, onComplete, speed = 30 }) {
  const [displayedText, setDisplayedText] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    if (!text || typeof text !== "string") return;
    setDisplayedText("");
    const chars = text.split("");
    let index = 0;

    timerRef.current = setInterval(() => {
      if (index >= chars.length) {
        clearInterval(timerRef.current);
        onComplete?.();
        return;
      }
      index++;
      setDisplayedText(chars.slice(0, index).join(""));
    }, speed);

    return () => clearInterval(timerRef.current);
  }, [text, speed]);

  const paragraphs = displayedText.split("\n").filter(Boolean);

  return (
    <div>
      {paragraphs.map((para, i) => (
        <p key={i} className="mb-1">{para}</p>
      ))}
      {displayedText.length < (text || "").length && (
        <span className="inline-block w-1.5 h-4 bg-primary-900 ml-0.5 animate-pulse" />
      )}
    </div>
  );
}
