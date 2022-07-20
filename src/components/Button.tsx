import React, { forwardRef, ForwardedRef } from "react";
import cn from "clsx";

type ButtonSize = "md" | "sm";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType;
  active?: boolean;
  size?: ButtonSize;
}

export const Button = forwardRef(
  (
    { children, icon, size = "md", active, ...props }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const Icon = icon;

    return (
      <button
        {...props}
        ref={ref}
        className={cn(
          "rounded hover:bg-slate-900",
          active && "bg-rose-600",
          size === "sm" && "w-6 h-6 p-1 mx-[0.2rem]",
          size === "md" && "w-8 h-8 p-2 mx-[0.2rem]"
        )}
      >
        {Icon && <Icon />}
        {children}
      </button>
    );
  }
);
