import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "sm" | "lg" | "ghost";
  href?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = ["btn"];
  if (variant === "sm") classes.push("sm");
  if (variant === "lg") classes.push("lg");
  if (variant === "ghost") classes.push("ghost");
  if (className) classes.push(className);
  const classString = classes.join(" ");

  if (href) {
    return (
      <a href={href} className={classString}>
        {children}
      </a>
    );
  }

  return (
    <button className={classString} {...props}>
      {children}
    </button>
  );
}
