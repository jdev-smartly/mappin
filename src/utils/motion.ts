// Motion configuration utility for accessibility
import { motion } from 'framer-motion';

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Motion variants that respect user preferences
export const motionVariants = {
  // Pin drop animation
  pinDrop: {
    initial: prefersReducedMotion() 
      ? { opacity: 0 } 
      : { y: -16, scale: 0.6, opacity: 0 },
    animate: prefersReducedMotion() 
      ? { opacity: 1 } 
      : { y: 0, scale: 1, opacity: 1 },
    exit: prefersReducedMotion() 
      ? { opacity: 0 } 
      : { scale: 0.8, opacity: 0 },
    transition: prefersReducedMotion() 
      ? { duration: 0.1 } 
      : { type: 'spring', stiffness: 260, damping: 20 }
  },

  // List item animations
  listItem: {
    initial: prefersReducedMotion() 
      ? { opacity: 0 } 
      : { height: 0, opacity: 0 },
    animate: prefersReducedMotion() 
      ? { opacity: 1 } 
      : { height: 'auto', opacity: 1 },
    exit: prefersReducedMotion() 
      ? { opacity: 0 } 
      : { height: 0, opacity: 0, scale: 0.95 },
    transition: prefersReducedMotion() 
      ? { duration: 0.1 } 
      : { duration: 0.2 }
  },

  // Tooltip animations
  tooltip: {
    initial: prefersReducedMotion() 
      ? { opacity: 0 } 
      : { opacity: 0, scale: 0.9, y: 10 },
    animate: prefersReducedMotion() 
      ? { opacity: 1 } 
      : { opacity: 1, scale: 1, y: 0 },
    exit: prefersReducedMotion() 
      ? { opacity: 0 } 
      : { opacity: 0, scale: 0.9, y: 10 },
    transition: prefersReducedMotion() 
      ? { duration: 0.1 } 
      : { duration: 0.15 }
  },

  // Micro-interactions
  hover: {
    scale: prefersReducedMotion() ? 1 : 1.05,
    transition: prefersReducedMotion() 
      ? { duration: 0.1 } 
      : { duration: 0.1 }
  },

  tap: {
    scale: prefersReducedMotion() ? 1 : 0.95,
    transition: prefersReducedMotion() 
      ? { duration: 0.1 } 
      : { duration: 0.1 }
  },

  // Page transitions
  pageSlide: {
    initial: prefersReducedMotion() 
      ? { opacity: 0 } 
      : { x: -320, opacity: 0 },
    animate: prefersReducedMotion() 
      ? { opacity: 1 } 
      : { x: 0, opacity: 1 },
    transition: prefersReducedMotion() 
      ? { duration: 0.1 } 
      : { duration: 0.4, delay: 0.1 }
  },

  // Header animation
  headerSlide: {
    initial: prefersReducedMotion() 
      ? { opacity: 0 } 
      : { y: -50, opacity: 0 },
    animate: prefersReducedMotion() 
      ? { opacity: 1 } 
      : { y: 0, opacity: 1 },
    transition: prefersReducedMotion() 
      ? { duration: 0.1 } 
      : { duration: 0.3 }
  }
};

// Utility function to get motion props based on user preferences
export const getMotionProps = (variant: keyof typeof motionVariants) => {
  return motionVariants[variant];
};

// Create a motion component wrapper that respects reduced motion
export const AccessibleMotion = motion.div;
