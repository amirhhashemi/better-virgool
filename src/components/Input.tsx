import React, { ForwardedRef, forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef(
  (
    { className, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input ref={ref} {...props} className={`p-1 bg-gray-100 ${className}`} />
    );
  }
);
