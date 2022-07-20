import React from "react";
import cn from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => {
    const classes = cn(
      "w-full py-2 px-4 rounded rounded-8 border focus:outline-none bg-gray-100 placeholder:text-right",
      className
    );

    return <input ref={ref} className={classes} {...rest} />;
  }
);
