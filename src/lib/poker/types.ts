export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export type PlayerAction = 'fold' | 'check' | 'call' | 'raise' | 'all-in';
export type PlayerStatus = 'active' | 'folded' | 'all-in' | 'waiting';
export type GamePhase = 'waiting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';

export interface Player {
  id: string;
  name: string;
  chips: number;
  holeCards: Card[];
  currentBet: number;
  status: PlayerStatus;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  isAI: boolean;
  position: number;
}

export interface GameState {
  players: Player[];
  communityCards: Card[];
  pot: number;
  currentBet: number;
  phase: GamePhase;
  activePlayerIndex: number;
  dealerIndex: number;
  smallBlind: number;
  bigBlind: number;
  deck: Card[];
}

export interface HandRanking {
  rank: number;
  name: string;
  cards: Card[];
}
