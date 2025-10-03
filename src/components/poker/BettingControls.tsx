import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayerAction } from '@/lib/poker/types';

interface BettingControlsProps {
  playerChips: number;
  currentBet: number;
  playerCurrentBet: number;
  minimumRaise: number;
  onAction: (action: PlayerAction, amount?: number) => void;
  disabled: boolean;
}

export function BettingControls({
  playerChips,
  currentBet,
  playerCurrentBet,
  minimumRaise,
  onAction,
  disabled,
}: BettingControlsProps) {
  const amountToCall = currentBet - playerCurrentBet;
  const canCheck = amountToCall === 0;
  const canRaise = playerChips > amountToCall;
  const maxRaise = playerChips - amountToCall;

  const [raiseAmount, setRaiseAmount] = useState(Math.min(minimumRaise, maxRaise));

  const handleRaise = () => {
    onAction('raise', amountToCall + raiseAmount);
  };

  const handleAllIn = () => {
    onAction('all-in', playerChips);
  };

  return (
    <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-xl p-4 space-y-4">
      <div className="text-center text-sm text-muted-foreground">
        Your Chips: <span className="text-accent font-bold">{playerChips}</span>
        {!canCheck && (
          <span className="ml-3">
            To Call: <span className="text-primary font-bold">{amountToCall}</span>
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={() => onAction('fold')}
          disabled={disabled}
          className="flex-1"
        >
          Fold
        </Button>

        {canCheck ? (
          <Button
            variant="secondary"
            onClick={() => onAction('check')}
            disabled={disabled}
            className="flex-1"
          >
            Check
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => onAction('call', amountToCall)}
            disabled={disabled || amountToCall >= playerChips}
            className="flex-1"
          >
            Call {amountToCall}
          </Button>
        )}

        {canRaise && (
          <Button
            onClick={handleRaise}
            disabled={disabled || maxRaise <= 0}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Raise {raiseAmount}
          </Button>
        )}

        <Button
          variant="outline"
          onClick={handleAllIn}
          disabled={disabled}
          className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          All In
        </Button>
      </div>

      {canRaise && maxRaise > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground text-center">
            Raise Amount: {raiseAmount}
          </div>
          <Slider
            value={[raiseAmount]}
            onValueChange={(value) => setRaiseAmount(value[0])}
            min={Math.min(minimumRaise, maxRaise)}
            max={maxRaise}
            step={10}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
