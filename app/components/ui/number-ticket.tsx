import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NumberTickerProps {
  value: number;
  className?: string;
}

export function NumberTicker({ value, className }: NumberTickerProps) {
  const prevValueRef = useRef(value);
  const [direction, setDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    if (value > prevValueRef.current) {
      setDirection("up");
    } else if (value < prevValueRef.current) {
      setDirection("down");
    }
    prevValueRef.current = value;
  }, [value]);

  const formatted = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  const variants = {
    initial: (dir: "up" | "down") => ({
      y: dir === "up" ? 15 : -15,
      opacity: 0,
    }),
    animate: { y: 0, opacity: 1 },
    exit: (dir: "up" | "down") => ({
      y: dir === "up" ? -15 : 15,
      opacity: 0,
    }),
  };

  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      <AnimatePresence mode="popLayout" custom={direction}>
        {formatted.split("").map((char, index) => {
          const isNumber = /\d/.test(char);

          return (
            <motion.span
              key={`${index}-${char}`}
              custom={direction}
              variants={isNumber ? variants : undefined}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </span>
  );
}