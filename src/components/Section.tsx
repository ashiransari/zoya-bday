import { Children, type ReactNode } from "react";
import { motion } from "framer-motion";
import { reducedMotion, SPRING, STAGGER } from "../lib/motion";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  rotation?: number;
}

export function Section({
  children,
  className = "",
  id,
  rotation = 0,
}: SectionProps) {
  const initial = reducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 24, rotate: rotation + 2 };
  const visible = reducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, rotate: rotation };

  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15%" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: STAGGER.children } },
      }}
    >
      {Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: initial,
            visible: {
              ...visible,
              transition: reducedMotion ? { duration: 0.2 } : SPRING.settle,
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.section>
  );
}
