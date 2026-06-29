import confettiModule from 'canvas-confetti';

export const fireConfetti = (options: any) => {
  let fire: any;
  
  if (confettiModule && typeof (confettiModule as any).create === 'function') {
    fire = (confettiModule as any).create(null, { resize: true, useWorker: true });
  } else if (confettiModule && typeof (confettiModule as any).default === 'function' && typeof (confettiModule as any).default.create === 'function') {
    fire = (confettiModule as any).default.create(null, { resize: true, useWorker: true });
  } else if (typeof confettiModule === 'function') {
    fire = confettiModule;
  }
  
  if (fire) {
    try {
      fire(options);
    } catch (e) {
      console.error('Confetti error:', e);
    }
  }
};
