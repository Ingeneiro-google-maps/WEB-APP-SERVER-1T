import confettiModule from 'canvas-confetti';

export const fireConfetti = (options: any) => {
  try {
    if (typeof confettiModule === 'function') {
      confettiModule(options);
    } else if (confettiModule && typeof (confettiModule as any).default === 'function') {
      (confettiModule as any).default(options);
    }
  } catch (e) {
    console.error('Confetti error:', e);
  }
};
