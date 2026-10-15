import React from "react";

interface EyebrowProps {
  number: string;
  text: string;
  className?: string;
}

export function Eyebrow({ number, text, className = "" }: EyebrowProps) {
  return (
    <p className={`eyebrow ${className}`.trim()}>
      <b>{number}</b> / {text}
    </p>
  );
}
