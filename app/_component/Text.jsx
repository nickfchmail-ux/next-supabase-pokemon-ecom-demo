"use client";

import { useState } from "react";

function Text({ textArray }) {
  const [showText, setShowText] = useState(false);

  const showFullText = textArray.length < 2 || showText;

  return (
    <div className="flex flex-col space-y-2 items-start">
      {showFullText
        ? textArray.map((text, index) => {
            return <p key={text}>{text}</p>;
          })
        : textArray.map((text, index) => {
            if (index < 2) return <p key={text}>{text}</p>;
          })}
      {textArray.length > 2 && (
        <button onClick={() => setShowText((pre) => !showText)}>
          {showText ? "less..." : "more..."}
        </button>
      )}
    </div>
  );
}

export default Text;
