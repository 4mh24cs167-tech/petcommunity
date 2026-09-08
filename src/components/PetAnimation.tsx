'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { PET_VARIANTS, PET_SPRINGS } from '@/lib/motion-variants';

interface PetAnimationProps extends HTMLMotionProps<'div'> {
  pattern?: 'pounce' | 'wag' | 'nudge' | 'zoomies';
  children: React.ReactNode;
  className?: string;
}

export default function PetAnimation({
  pattern = 'pounce',
  children,
  className = '',
  ...props
}: PetAnimationProps) {
  const getVariants = () => {
    switch (pattern) {
      case 'pounce': return PET_VARIANTS.pounce;
      case 'wag': return PET_VARIANTS.wag;
      case 'nudge': return PET_VARIANTS.nudge;
      default: return {};
    }
  };

  const getTransition = () => {
    switch (pattern) {
      case 'pounce': return PET_SPRINGS.pounce;
      case 'wag': return PET_SPRINGS.wag;
      case 'nudge': return PET_SPRINGS.nudge;
      case 'zoomies': return PET_SPRINGS.zoomies;
      default: return {};
    }
  };

  return (
    <motion.div
      initial={pattern === 'pounce' ? PET_VARIANTS.pounce.hidden : undefined}
      whileInView={pattern === 'pounce' ? PET_VARIANTS.pounce.visible : undefined}
      viewport={{ once: true }}
      whileHover={pattern === 'nudge' ? PET_VARIANTS.nudge.hover : undefined}
      animate={pattern === 'wag' ? PET_VARIANTS.wag.animate : undefined}
      transition={getTransition()}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
