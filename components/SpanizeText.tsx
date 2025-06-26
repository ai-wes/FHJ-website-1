import React from "react";
import styles from "./SpanizeText.module.css";

interface SpanizeTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  delayStep?: number; // seconds
  animate?: boolean;
}

export const SpanizeText: React.FC<SpanizeTextProps> = ({
  text,
  className = "",
  as = "span",
  delayStep = 0.035,
  animate = true,
}) => {
  const Tag = as as any;
  let charIndex = 0;
  if (!animate) {
    return <Tag className={className}>{text}</Tag>;
  }
  return (
    <Tag className={className + " " + styles.letterGlowWrapper}>
      {text.split("\n").map((line, lineIdx) => (
        <React.Fragment key={lineIdx}>
          {line.split("").map((char, i) => {
            // Don't animate spaces
            if (char === " ") {
              charIndex++;
              return (
                <span key={i} className={styles.letterGlowSpace}>
                  {" "}
                </span>
              );
            }
            const style = {
              animationDelay: `${charIndex * delayStep}s`,
            };
            charIndex++;
            return (
              <span key={i} className={styles.letterGlow} style={style}>
                {char}
              </span>
            );
          })}
          {lineIdx < text.split("\n").length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
};
