import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionTimerProps {
  duration?: number;
  onTimeout?: () => void;
}

export function ActionTimer({ duration = 30, onTimeout }: ActionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onTimeout]);

  const percentage = (timeLeft / duration) * 100;
  const getColor = () => {
    if (percentage > 66) return 'text-success border-success';
    if (percentage > 33) return 'text-primary border-primary';
    return 'text-destructive border-destructive';
  };

  return (
    <div className={cn(
      "relative w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold transition-colors",
      getColor(),
      timeLeft <= 5 && "animate-pulse"
    )}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={`${percentage * 1.256} 125.6`}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="flex items-center gap-0.5 z-10">
        <Clock className="w-3 h-3" />
        <span className="text-xs">{timeLeft}</span>
      </div>
    </div>
  );
}
