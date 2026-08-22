import { forwardRef } from "react";
import useRipple from "../../hooks/useRipple.js";
import { cn } from "../../lib/utils.js";

const RippleButton = forwardRef(({ children, className, onClick, disabled, type = "button", ...props }, ref) => {
  const ripple = useRipple();

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerDown={ripple}
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center rounded-lg font-heading font-semibold tracking-wider transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2",
        "active:scale-95 disabled:pointer-events-none disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

RippleButton.displayName = "RippleButton";

export default RippleButton;
