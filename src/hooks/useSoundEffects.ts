import { useCallback, useRef } from 'react';

type SoundType = 'cardDeal' | 'chipSlide' | 'buttonClick' | 'winner' | 'fold' | 'timer';

export function useSoundEffects() {
  const audioContext = useRef<AudioContext | null>(null);
  const enabled = useRef(true);

  const initAudioContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, volume: number = 0.3) => {
    if (!enabled.current) return;

    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [initAudioContext]);

  const playSound = useCallback((type: SoundType) => {
    if (!enabled.current) return;

    switch (type) {
      case 'cardDeal':
        playTone(800, 0.1, 0.2);
        break;
      case 'chipSlide':
        playTone(400, 0.15, 0.25);
        setTimeout(() => playTone(350, 0.1, 0.15), 50);
        break;
      case 'buttonClick':
        playTone(600, 0.05, 0.3);
        break;
      case 'winner':
        playTone(523, 0.2, 0.3); // C
        setTimeout(() => playTone(659, 0.2, 0.3), 150); // E
        setTimeout(() => playTone(784, 0.3, 0.3), 300); // G
        break;
      case 'fold':
        playTone(300, 0.2, 0.2);
        break;
      case 'timer':
        playTone(1000, 0.1, 0.4);
        break;
    }
  }, [playTone]);

  const toggleSound = useCallback(() => {
    enabled.current = !enabled.current;
    return enabled.current;
  }, []);

  return {
    playSound,
    toggleSound,
    isEnabled: () => enabled.current,
  };
}
