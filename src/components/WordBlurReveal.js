"use client";

import { motion } from "framer-motion";

export default function WordBlurReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.045,
  as: Component = "span",
  children,
}) {
  // If raw children are provided instead of a simple string
  if (children) {
    return (
      <Component className={className}>
        {children}
      </Component>
    );
  }

  const words = text ? text.split(" ") : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 8,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Apple-style fluid easeOut
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      style={{ display: "inline" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariants}
          style={{
            display: "inline-block",
            willChange: "filter, opacity, transform",
            whiteSpace: "pre",
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
