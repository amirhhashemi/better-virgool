import React from "react";
import cn from "clsx";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ButtonGroup = ({
  children,
  className,
  ...rest
}: ButtonGroupProps) => {
  const classes = cn("flex items-center", className);

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};
