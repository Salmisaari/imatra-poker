import { useState, useEffect } from 'react';
import { GameState, Player, PlayerAction, GamePhase } from '@/lib/poker/types';
import { createDeck } from '@/lib/poker/deck';
import { evaluateHand, compareHands } from '@/lib/poker/handEvaluator';
import { getAIAction } from '@/lib/poker/aiPlayer';
import { PlayerPosition } from './PlayerPosition';
import { BettingControls } from './BettingControls';
import { Card } from './Card';
import { Circle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SMALL_BLIND = 10;
const BIG_BLIND = 20;
const STARTING_CHIPS = 1000;

export function PokerTable() {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [isProcessing, setIsProcessing] = useState(false);

  // Process AI turns
  useEffect(() => {
    if (isProcessing) return;
    if (gameState.phase === 'showdown' || gameState.phase === 'waiting') return;

    const activePlayer = gameState.players[gameState.activePlayerIndex];
    if (!activePlayer || activePlayer.status !== 'active') return;

    if (activePlayer.isAI) {
      setIsProcessing(true);
      setTimeout(() => {
        processAITurn();
        setIsProcessing(false);
      }, 1000);
    }
  }, [gameState.activePlayerIndex, gameState.phase, isProcessing]);

  function initializeGame(): GameState {
    const players: Player[] = [
      {
        id: 'player',
        name: 'You',
        chips: STARTING_CHIPS,
        holeCards: [],
        currentBet: 0,
        status: 'active',
        isDealer: false,
        isSmallBlind: false,
        isBigBlind: false,
        isAI: false,
        position: 0,
      },
      {
        id: 'ai1',
        name: 'Alice',
        chips: STARTING_CHIPS,
        holeCards: [],
        currentBet: 0,
        status: 'active',
        isDealer: true,
        isSmallBlind: false,
        isBigBlind: false,
        isAI: true,
        position: 1,
      },
      {
        id: 'ai2',
        name: 'Bob',
        chips: STARTING_CHIPS,
        holeCards: [],
        currentBet: 0,
        status: 'active',
        isDealer: false,
        isSmallBlind: true,
        isBigBlind: false,
        isAI: true,
        position: 2,
      },
      {
        id: 'ai3',
        name: 'Charlie',
        chips: STARTING_CHIPS,
        holeCards: [],
        currentBet: 0,
        status: 'active',
        isDealer: false,
        isSmallBlind: false,
        isBigBlind: true,
        isAI: true,
        position: 3,
      },
    ];

    return startNewHand({
      players,
      communityCards: [],
      pot: 0,
      currentBet: 0,
      phase: 'waiting',
      activePlayerIndex: 0,
      dealerIndex: 1,
      smallBlind: SMALL_BLIND,
      bigBlind: BIG_BLIND,
      deck: createDeck(),
    });
  }

  function startNewHand(prevState: GameState): GameState {
    const deck = createDeck();
    const players = prevState.players.map(p => ({
      ...p,
      holeCards: [],
      currentBet: 0,
      status: p.chips > 0 ? ('active' as const) : ('folded' as const),
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
    }));

    // Rotate dealer
    const dealerIndex = (prevState.dealerIndex + 1) % players.length;
    const sbIndex = (dealerIndex + 1) % players.length;
    const bbIndex = (dealerIndex + 2) % players.length;

    players[dealerIndex].isDealer = true;
    players[sbIndex].isSmallBlind = true;
    players[bbIndex].isBigBlind = true;

    // Post blinds
    players[sbIndex].currentBet = SMALL_BLIND;
    players[sbIndex].chips -= SMALL_BLIND;
    players[bbIndex].currentBet = BIG_BLIND;
    players[bbIndex].chips -= BIG_BLIND;

    // Deal hole cards
    let deckCopy = [...deck];
    for (let i = 0; i < 2; i++) {
      for (const player of players) {
        if (player.status === 'active') {
          const [card, ...remaining] = deckCopy;
          player.holeCards.push({ ...card, faceUp: false });
          deckCopy = remaining;
        }
      }
    }

    const firstToAct = (bbIndex + 1) % players.length;

    return {
      players,
      communityCards: [],
      pot: SMALL_BLIND + BIG_BLIND,
      currentBet: BIG_BLIND,
      phase: 'preflop',
      activePlayerIndex: firstToAct,
      dealerIndex,
      smallBlind: SMALL_BLIND,
      bigBlind: BIG_BLIND,
      deck: deckCopy,
    };
  }

  function handlePlayerAction(action: PlayerAction, amount?: number) {
    setGameState(prev => processAction(prev, action, amount));
  }

  function processAITurn() {
    setGameState(prev => {
      const activePlayer = prev.players[prev.activePlayerIndex];
      const { action, raiseAmount } = getAIAction(activePlayer, prev);
      
      toast({
        description: `${activePlayer.name} ${action}${raiseAmount ? ` ${raiseAmount}` : ''}`,
        duration: 1500,
      });

      return processAction(prev, action, raiseAmount);
    });
  }

  function processAction(state: GameState, action: PlayerAction, amount?: number): GameState {
    const newState = { ...state };
    const player = newState.players[newState.activePlayerIndex];

    switch (action) {
      case 'fold':
        player.status = 'folded';
        break;

      case 'check':
        // No changes needed
        break;

      case 'call': {
        const callAmount = Math.min(newState.currentBet - player.currentBet, player.chips);
        player.chips -= callAmount;
        player.currentBet += callAmount;
        newState.pot += callAmount;
        if (player.chips === 0) player.status = 'all-in';
        break;
      }

      case 'raise': {
        const raiseAmount = Math.min(amount || 0, player.chips);
        player.chips -= raiseAmount;
        player.currentBet += raiseAmount;
        newState.pot += raiseAmount;
        newState.currentBet = player.currentBet;
        if (player.chips === 0) player.status = 'all-in';
        break;
      }

      case 'all-in': {
        const allInAmount = player.chips;
        player.chips = 0;
        player.currentBet += allInAmount;
        newState.pot += allInAmount;
        if (player.currentBet > newState.currentBet) {
          newState.currentBet = player.currentBet;
        }
        player.status = 'all-in';
        break;
      }
    }

    return advanceGame(newState);
  }

  function advanceGame(state: GameState): GameState {
    const activePlayers = state.players.filter(p => p.status === 'active');
    
    // Check if only one player remains
    if (activePlayers.length === 1) {
      return determineWinner(state);
    }

    // Find next active player
    let nextIndex = (state.activePlayerIndex + 1) % state.players.length;
    let attempts = 0;
    while (state.players[nextIndex].status !== 'active' && attempts < state.players.length) {
      nextIndex = (nextIndex + 1) % state.players.length;
      attempts++;
    }

    // Check if betting round is complete
    const allBetsEqual = activePlayers.every(p => p.currentBet === state.currentBet);
    
    // Determine the first player who should act in this betting round
    let firstToActThisRound: number;
    if (state.phase === 'preflop') {
      // Preflop: first to act is UTG (player after big blind)
      const bbIndex = state.players.findIndex(p => p.isBigBlind);
      firstToActThisRound = (bbIndex + 1) % state.players.length;
      // Find first active player from that position
      let tempIdx = firstToActThisRound;
      let searchAttempts = 0;
      while (state.players[tempIdx].status !== 'active' && searchAttempts < state.players.length) {
        tempIdx = (tempIdx + 1) % state.players.length;
        searchAttempts++;
      }
      firstToActThisRound = tempIdx;
    } else {
      // Post-flop: first to act is first active player after dealer
      firstToActThisRound = (state.dealerIndex + 1) % state.players.length;
      let tempIdx = firstToActThisRound;
      let searchAttempts = 0;
      while (state.players[tempIdx].status !== 'active' && searchAttempts < state.players.length) {
        tempIdx = (tempIdx + 1) % state.players.length;
        searchAttempts++;
      }
      firstToActThisRound = tempIdx;
    }
    
    // Round is complete if all bets are equal and we've cycled back to first actor
    const roundComplete = allBetsEqual && nextIndex === firstToActThisRound;

    if (roundComplete || activePlayers.length === 1) {
      return advancePhase(state);
    }

    return { ...state, activePlayerIndex: nextIndex };
  }

  function advancePhase(state: GameState): GameState {
    const newState = { ...state };
    newState.players.forEach(p => (p.currentBet = 0));

    switch (state.phase) {
      case 'preflop':
        // Deal flop
        const flop = newState.deck.slice(0, 3).map(c => ({ ...c, faceUp: true }));
        newState.communityCards = flop;
        newState.deck = newState.deck.slice(3);
        newState.phase = 'flop';
        break;

      case 'flop':
        // Deal turn
        const turn = { ...newState.deck[0], faceUp: true };
        newState.communityCards.push(turn);
        newState.deck = newState.deck.slice(1);
        newState.phase = 'turn';
        break;

      case 'turn':
        // Deal river
        const river = { ...newState.deck[0], faceUp: true };
        newState.communityCards.push(river);
        newState.deck = newState.deck.slice(1);
        newState.phase = 'river';
        break;

      case 'river':
        return determineWinner(newState);
    }

    newState.currentBet = 0;
    
    // After flop/turn/river, first to act is first active player after dealer (small blind position)
    let firstToAct = (newState.dealerIndex + 1) % newState.players.length;
    let attempts = 0;
    while (newState.players[firstToAct].status !== 'active' && attempts < newState.players.length) {
      firstToAct = (firstToAct + 1) % newState.players.length;
      attempts++;
    }
    
    newState.activePlayerIndex = firstToAct;

    return newState;
  }

  function determineWinner(state: GameState): GameState {
    const newState = { ...state };
    newState.phase = 'showdown';

    const activePlayers = newState.players.filter(
      p => p.status === 'active' || p.status === 'all-in'
    );

    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      winner.chips += newState.pot;
      toast({
        title: `${winner.name} wins!`,
        description: `Won ${newState.pot} chips`,
      });
    } else {
      const playerHands = activePlayers.map(p => ({
        player: p,
        hand: evaluateHand([...p.holeCards.map(c => ({ ...c, faceUp: true })), ...newState.communityCards]),
      }));

      playerHands.sort((a, b) => compareHands(b.hand, a.hand));
      const winner = playerHands[0];

      winner.player.chips += newState.pot;
      toast({
        title: `${winner.player.name} wins!`,
        description: `${winner.hand.name} - Won ${newState.pot} chips`,
      });

      // Show all hands
      newState.players.forEach(p => {
        if (p.status !== 'folded') {
          p.holeCards = p.holeCards.map(c => ({ ...c, faceUp: true }));
        }
      });
    }

    setTimeout(() => {
      setGameState(prev => startNewHand(prev));
    }, 5000);

    return newState;
  }

  const humanPlayer = gameState.players[0];
  const isPlayerTurn = gameState.activePlayerIndex === 0 && gameState.phase !== 'showdown';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Poker Table */}
        <div className="relative bg-gradient-to-br from-table-felt to-table-felt-dark rounded-[50%] border-8 border-table-edge aspect-[16/10] shadow-2xl p-8">
          {/* Top Players */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-8">
            {gameState.players.slice(1, 3).map(player => (
              <PlayerPosition
                key={player.id}
                player={player}
                isActive={gameState.players[gameState.activePlayerIndex]?.id === player.id}
                showCards={false}
              />
            ))}
          </div>

          {/* Right Player */}
          {gameState.players[3] && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <PlayerPosition
                player={gameState.players[3]}
                isActive={gameState.players[gameState.activePlayerIndex]?.id === gameState.players[3].id}
                showCards={false}
              />
            </div>
          )}

          {/* Center - Pot and Community Cards */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
            {/* Pot */}
            <div className="bg-background/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-primary/50">
              <div className="flex items-center gap-2">
                <Circle className="w-5 h-5 fill-chip-gold text-chip-gold" />
                <span className="text-2xl font-bold text-foreground">Pot: {gameState.pot}</span>
              </div>
            </div>

            {/* Community Cards */}
            {gameState.communityCards.length > 0 && (
              <div className="flex gap-2">
                {gameState.communityCards.map((card, idx) => (
                  <Card key={idx} card={card} delay={idx * 150} />
                ))}
              </div>
            )}

            {/* Phase Indicator */}
            <div className="text-sm text-foreground/70 uppercase tracking-wider font-semibold">
              {gameState.phase}
            </div>
          </div>

          {/* Bottom - Human Player */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <PlayerPosition
              player={humanPlayer}
              isActive={isPlayerTurn}
              showCards={true}
            />
          </div>
        </div>

        {/* Betting Controls */}
        {gameState.phase !== 'showdown' && gameState.phase !== 'waiting' && (
          <div className="mt-6">
            <BettingControls
              playerChips={humanPlayer.chips}
              currentBet={gameState.currentBet}
              playerCurrentBet={humanPlayer.currentBet}
              minimumRaise={gameState.bigBlind * 2}
              onAction={handlePlayerAction}
              disabled={!isPlayerTurn || isProcessing}
            />
          </div>
        )}
      </div>
    </div>
  );
}
