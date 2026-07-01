export const fireConfetti = async (options: any) => {
  try {
    const m = await import('canvas-confetti');
    
    if (m && typeof (m as any).create === 'function') {
      const fire = (m as any).create(null, { resize: true, useWorker: true });
      fire(options);
    } else if (m && (m as any).default && typeof (m as any).default.create === 'function') {
      const fire = (m as any).default.create(null, { resize: true, useWorker: true });
      fire(options);
    } else if (m && typeof (m as any).default === 'function') {
      if ((m as any).default.name === 'confettiCannon') {
        const fire = (m as any).default(null, { resize: true, useWorker: true });
        fire(options);
      } else {
        (m as any).default(options);
      }
    } else if (typeof m === 'function') {
      if ((m as any).name === 'confettiCannon') {
        const fire = (m as any)(null, { resize: true, useWorker: true });
        fire(options);
      } else {
        (m as any)(options);
      }
    }
  } catch (e) {
    console.error('Confetti error:', e);
  }
};



