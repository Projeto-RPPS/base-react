import React from "react";
import classNames from "classnames";

export default function Button({
  variant = "primary",
  size,
  circle = false,
  block = false,
  loading = false,
  inverted = false,
  disabled = false,
  children,
  className,
  ...props
}) {
  const classes = classNames(
    "br-button",
    variant,
    size,
    { circle, block, loading, "dark-mode": inverted },
    className
  );
  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {children}
    </button>
  );
}