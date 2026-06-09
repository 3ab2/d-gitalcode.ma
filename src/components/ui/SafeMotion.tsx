"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type SafeMotionDivProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode;
};

export function SafeMotionDiv({
  children,
  initial,
  animate,
  whileInView,
  viewport,
  transition,
  className,
  ...props
}: SafeMotionDivProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={initial ?? false}
      animate={animate}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}
