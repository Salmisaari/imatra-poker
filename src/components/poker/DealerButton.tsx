import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';

interface DealerButtonProps {
  playerIndex: number;
}

export function DealerButton({ playerIndex }: DealerButtonProps) {
  return (
    <Badge 
      className="absolute -top-2 -right-2 bg-dealer-button text-primary-foreground font-bold px-2 py-1 text-xs border-2 border-primary-foreground shadow-lg"
    >
      <Circle className="w-3 h-3 fill-current mr-1" />
      D
    </Badge>
  );
}
