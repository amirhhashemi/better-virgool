import cn from "clsx";

import { ReactNode } from "react";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ButtonGroup = ({
  children,
  className,
  ...props
}: ButtonGroupProps) => {
  const classes = cn(className, "mx-2");

  return (
    <div {...props} className={classes}>
      {children}
    </div>
  );
};
