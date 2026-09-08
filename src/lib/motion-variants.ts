export const PET_SPRINGS = {
  pounce: { type: 'spring', stiffness: 400, damping: 15 }, // Snappy, high energy
  wag: { type: 'spring', stiffness: 100, damping: 10 },    // Soft, rhythmic
  nudge: { type: 'spring', stiffness: 200, damping: 20 },   // Balanced, organic
  zoomies: { type: 'spring', stiffness: 500, damping: 12 },  // Fast, aggressive
};

export const PET_VARIANTS = {
  pounce: {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15
      }
    },
  },
  wag: {
    animate: {
      rotate: [-3, 3, -3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },
  nudge: {
    hover: {
      y: -5,
      rotate: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
  }
};
