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

  return (
    <div className="bg-background/95 backdrop-blur-sm border-t-2 border-primary/50 rounded-t-3xl p-6 space-y-4 shadow-2xl animate-slide-in-bottom">
      <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-2" />
      
      <div className="text-center text-sm text-muted-foreground">
        Your chips: <span className="text-accent font-bold">{playerChips}</span>
        {!canCheck && (
          <span className="ml-3">
            To call: <span className="text-primary font-bold">{amountToCall}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {/* Call Button */}
        {!canCheck && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-green-500 text-sm font-bold">C</span>
            <Button
              onClick={() => onAction('call', amountToCall)}
              disabled={disabled || amountToCall >= playerChips}
              className="w-full h-24 bg-black/80 hover:bg-black/90 border-2 border-green-500 text-green-500 hover:text-green-400 text-xl font-bold rounded-2xl"
            >
              CALL {amountToCall}
            </Button>
          </div>
        )}

        {/* Raise Button */}
        {canRaise && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-green-500 text-sm font-bold">R</span>
            <Button
              onClick={handleRaise}
              disabled={disabled || maxRaise <= 0}
              className="w-full h-24 bg-black/80 hover:bg-black/90 border-2 border-green-500 text-green-500 hover:text-green-400 text-xl font-bold rounded-2xl"
            >
              RAISE
            </Button>
          </div>
        )}

        {/* Check Button */}
        {canCheck && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-gray-500 text-sm font-bold">K</span>
            <Button
              onClick={() => onAction('check')}
              disabled={disabled}
              className="w-full h-24 bg-black/80 hover:bg-black/90 border-2 border-gray-600 text-gray-500 hover:text-gray-400 text-xl font-bold rounded-2xl"
            >
              CHECK
            </Button>
          </div>
        )}

        {/* Fold Button */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-orange-500 text-sm font-bold">F</span>
          <Button
            onClick={() => onAction('fold')}
            disabled={disabled}
            className="w-full h-24 bg-black/80 hover:bg-black/90 border-2 border-orange-500 text-orange-500 hover:text-orange-400 text-xl font-bold rounded-2xl"
          >
            FOLD
          </Button>
        </div>
      </div>

      {canRaise && maxRaise > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground text-center">
            Raise amount: {raiseAmount}
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
