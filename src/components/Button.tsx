import React from "react";
import cn from "clsx";

type ButtonSize = "md" | "sm";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType;
  active?: boolean;
  size?: ButtonSize;
}

export const Button = ({
  children,
  icon,
  size = "md",
  active,
  ...props
}: ButtonProps) => {
  const Icon = icon;

  return (
    <button
      {...props}
      className={cn(
        "rounded",
        active && "bg-rose-600",
        size === "sm" && "w-6 h-6 p-1 mx-[0.2rem]",
        size === "md" && "w-8 h-8 p-2 mx-[0.2rem]"
      )}
    >
      {Icon && <Icon />}
      {children}
    </button>
  );
};
