'use client';

import { animate, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedValueProps {
  value: number;
  unit?: string;
  className?: string;
}

export function AnimatedValue({ value, unit = '', className = 'tabular-nums' }: AnimatedValueProps) {
  const count = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
      onUpdate: (latest) => {
        if (nodeRef.current) {
          nodeRef.current.textContent = Math.ceil(latest).toString();
        }
      }
    });

    return () => animation.stop();
  }, [value, count]);

  return (
    <span className={className}>
      <span ref={nodeRef}>0</span>
      {unit}
    </span>
  );
}
