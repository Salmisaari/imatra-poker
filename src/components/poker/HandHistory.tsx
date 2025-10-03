import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Circle } from 'lucide-react';

interface HandRecord {
  handNumber: number;
  winner: string;
  winningHand: string;
  pot: number;
}

interface HandHistoryProps {
  hands: HandRecord[];
}

export function HandHistory({ hands }: HandHistoryProps) {
  return (
    <Card className="bg-card/95 backdrop-blur-sm border-primary/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Hand History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {hands.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hands played yet
              </p>
            ) : (
              hands.slice().reverse().map((hand) => (
                <div
                  key={hand.handNumber}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      Hand #{hand.handNumber}
                    </span>
                    <div className="flex items-center gap-1 text-chip-gold text-sm font-bold">
                      <Circle className="w-3 h-3 fill-current" />
                      {hand.pot}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {hand.winner}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {hand.winningHand}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
