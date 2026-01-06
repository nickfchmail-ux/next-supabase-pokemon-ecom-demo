"use client";

import { useState } from "react";

function Text({ textArray }) {
  const [showText, setShowText] = useState(false);

  const showFullText = textArray.length < 2 || showText;

  if (!textArray?.length > 0)
    return (
      <div className="flex flex-col space-y-2 items-start">
        神秘的實可夢... 在數據庫找不到資料...
      </div>
    );


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
