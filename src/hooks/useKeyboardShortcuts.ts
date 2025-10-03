import { useEffect } from 'react';
import { PlayerAction } from '@/lib/poker/types';

interface UseKeyboardShortcutsProps {
  onAction: (action: PlayerAction, amount?: number) => void;
  disabled?: boolean;
  canCheck: boolean;
  callAmount: number;
}

export function useKeyboardShortcuts({
  onAction,
  disabled,
  canCheck,
  callAmount,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    if (disabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'f':
          onAction('fold');
          break;
        case 'c':
          if (canCheck) {
            onAction('check');
          } else {
            onAction('call', callAmount);
          }
          break;
        case 'r':
          // Trigger raise with default amount
          break;
        case 'a':
          onAction('all-in');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [disabled, canCheck, callAmount, onAction]);
}
