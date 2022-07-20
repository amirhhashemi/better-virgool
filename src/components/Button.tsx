import React from "react";
import cn from "clsx";

type ButtonSize = "md" | "sm";
type ButtonVariant = "toolbar";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  isActive?: boolean;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, size = "md", variant = "toolbar", icon, isActive, ...rest },
    ref
  ) => {
    const classes = cn(
      "outline-none rounded font-bold",
      "flex items-center justify-center ease-in-out",
      "transition duration-200",
      size === "sm" && "w-6 h-6 p-1",
      size === "md" && "w-8 h-8 p-2",
      variant === "toolbar" && [
        isActive ? "bg-rose-500" : "bg-black",
        "border-transparent hover:border-rose-500 hover:border",
      ]
    );

    return (
      <button ref={ref} className={classes} {...rest}>
        <span className="flex items-center">
          {icon && <span className="m-2 flex items-center">{icon}</span>}
          {children}
        </span>
      </button>
    );
  }
);
