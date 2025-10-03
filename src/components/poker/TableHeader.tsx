import { Button } from '@/components/ui/button';
import { Settings, LogOut, HelpCircle } from 'lucide-react';

interface TableHeaderProps {
  tableName: string;
  handNumber: number;
  smallBlind: number;
  bigBlind: number;
  onExit?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
}

export function TableHeader({
  tableName,
  handNumber,
  smallBlind,
  bigBlind,
  onExit,
  onSettings,
  onHelp,
}: TableHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left - Table Info */}
        <div className="text-sm font-medium text-foreground">
          {tableName}
        </div>

        {/* Center - Game Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Hand #{handNumber}</span>
          <span className="text-primary">
            Blinds: {smallBlind}/{bigBlind}
          </span>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {onSettings && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettings}
              className="hover:bg-muted"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
          {onHelp && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onHelp}
              className="hover:bg-muted"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          )}
          {onExit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
