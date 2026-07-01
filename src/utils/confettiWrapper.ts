export const fireConfetti = async (options: any) => {
  try {
    const m = await import('canvas-confetti');
    
    if (m && typeof (m as any).default === 'function') {
      (m as any).default(options);
    } else if (typeof m === 'function') {
      (m as any)(options);
    } else if (m && (m as any).confetti) {
      (m as any).confetti(options);
    }
  } catch (e) {
    console.error('Confetti error:', e);
  }
};



