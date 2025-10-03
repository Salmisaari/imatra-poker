import { useState, useEffect, useCallback } from 'react';
import { GameState, Player, PlayerAction, GamePhase } from '@/lib/poker/types';
import { createDeck } from '@/lib/poker/deck';
import { evaluateHand, compareHands } from '@/lib/poker/handEvaluator';
import { getAIAction } from '@/lib/poker/aiPlayer';
import { PlayerPosition } from './PlayerPosition';
import { EnhancedPlayerPosition } from './EnhancedPlayerPosition';
import { BettingControls } from './BettingControls';
import { Card } from './Card';
import { DealerButton } from './DealerButton';
import { ChipStack } from './ChipStack';
import { TableHeader } from './TableHeader';
import { Circle, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import clubGTable from '@/assets/club-g-table.png';

const SMALL_BLIND = 10;
const BIG_BLIND = 20;
const STARTING_CHIPS = 1000;

export function PokerTable() {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [isProcessing, setIsProcessing] = useState(false);
  const [dealingCards, setDealingCards] = useState(false);
  const [revealingCards, setRevealingCards] = useState(false);
  const [celebratingWinner, setCelebratingWinner] = useState(false);
  const [handNumber, setHandNumber] = useState(1);
  const [winningAmount, setWinningAmount] = useState(0);
  const { playSound } = useSoundEffects();

  const processAITurn = useCallback(() => {
    setGameState(prev => {
      const activePlayer = prev.players[prev.activePlayerIndex];
      const { action, raiseAmount } = getAIAction(activePlayer, prev);
      
      // Play sound effects
      if (action === 'fold') playSound('fold');
      else playSound('chipSlide');
      
      toast({
        description: `${activePlayer.name} ${action}${raiseAmount ? ` ${raiseAmount}` : ''}`,
        duration: 1500,
      });

      return processAction(prev, action, raiseAmount);
    });
  }, [playSound]);

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
  }, [gameState.activePlayerIndex, gameState.phase, isProcessing, processAITurn]);

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
        name: 'Jaakko',
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
        name: 'Saku',
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
        name: 'Veeti',
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
      {
        id: 'ai4',
        name: 'Tuomas',
        chips: STARTING_CHIPS,
        holeCards: [],
        currentBet: 0,
        status: 'active',
        isDealer: false,
        isSmallBlind: false,
        isBigBlind: false,
        isAI: true,
        position: 4,
      },
      {
        id: 'ai5',
        name: 'Johannes',
        chips: STARTING_CHIPS,
        holeCards: [],
        currentBet: 0,
        status: 'active',
        isDealer: false,
        isSmallBlind: false,
        isBigBlind: false,
        isAI: true,
        position: 5,
      },
    ];

    // Create initial state without calling startNewHand (to avoid state setter issues during init)
    return createHandState(players, 1);
  }

  function createHandState(players: Player[], dealerIndex: number): GameState {
    const deck = createDeck();
    const preparedPlayers = players.map(p => ({
      ...p,
      holeCards: [],
      currentBet: 0,
      status: p.chips > 0 ? ('active' as const) : ('folded' as const),
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
    }));

    // Set dealer, blinds
    const sbIndex = (dealerIndex + 1) % preparedPlayers.length;
    const bbIndex = (dealerIndex + 2) % preparedPlayers.length;

    preparedPlayers[dealerIndex].isDealer = true;
    preparedPlayers[sbIndex].isSmallBlind = true;
    preparedPlayers[bbIndex].isBigBlind = true;

    // Post blinds
    preparedPlayers[sbIndex].currentBet = SMALL_BLIND;
    preparedPlayers[sbIndex].chips -= SMALL_BLIND;
    preparedPlayers[bbIndex].currentBet = BIG_BLIND;
    preparedPlayers[bbIndex].chips -= BIG_BLIND;

    // Deal hole cards
    let deckCopy = [...deck];
    for (let i = 0; i < 2; i++) {
      for (const player of preparedPlayers) {
        if (player.status === 'active') {
          const [card, ...remaining] = deckCopy;
          player.holeCards.push({ ...card, faceUp: false });
          deckCopy = remaining;
        }
      }
    }

    const firstToAct = (bbIndex + 1) % preparedPlayers.length;

    return {
      players: preparedPlayers,
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

  function startNewHand(prevState: GameState): GameState {
    setDealingCards(true);
    setRevealingCards(false);
    setCelebratingWinner(false);
    setHandNumber(prev => prev + 1);
    playSound('cardDeal');

    // Rotate dealer counter-clockwise
    const newDealerIndex = (prevState.dealerIndex - 1 + prevState.players.length) % prevState.players.length;
    
    // Simulate dealing animation
    setTimeout(() => {
      setDealingCards(false);
    }, 2000);

    return createHandState(prevState.players, newDealerIndex);
  }

  function handlePlayerAction(action: PlayerAction, amount?: number) {
    playSound(action === 'fold' ? 'fold' : 'chipSlide');
    setGameState(prev => processAction(prev, action, amount));
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
        const flop = newState.deck.slice(1, 4).map(c => ({ ...c, faceUp: true }));
        newState.communityCards = flop;
        newState.deck = newState.deck.slice(4);
        newState.phase = 'flop';
        break;

      case 'flop':
        // Deal turn
        const turn = { ...newState.deck[1], faceUp: true };
        newState.communityCards.push(turn);
        newState.deck = newState.deck.slice(2);
        newState.phase = 'turn';
        break;

      case 'turn':
        // Deal river
        const river = { ...newState.deck[1], faceUp: true };
        newState.communityCards.push(river);
        newState.deck = newState.deck.slice(2);
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
    
    setRevealingCards(true);

    const activePlayers = newState.players.filter(
      p => p.status === 'active' || p.status === 'all-in'
    );

    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      
      setTimeout(() => {
        setCelebratingWinner(true);
        playSound('winner');
        setWinningAmount(newState.pot);
        setGameState(prev => {
          const updatedPlayers = prev.players.map(p => 
            p.id === winner.id ? { ...p, chips: p.chips + prev.pot } : p
          );
          
          toast({
            title: `🎉 ${winner.name} wins!`,
            description: `Won ${prev.pot} chips`,
          });

          return { ...prev, players: updatedPlayers, pot: 0 };
        });

        setTimeout(() => {
          setGameState(prev => startNewHand(prev));
        }, 4000);
      }, 1000);
    } else {
      // Reveal cards
      newState.players.forEach(p => {
        if (p.status !== 'folded') {
          p.holeCards = p.holeCards.map(c => ({ ...c, faceUp: true }));
        }
      });

      setTimeout(() => {
        const playerHands = activePlayers.map(p => ({
          player: p,
          hand: evaluateHand([...p.holeCards.map(c => ({ ...c, faceUp: true })), ...newState.communityCards]),
        }));

        playerHands.sort((a, b) => compareHands(b.hand, a.hand));
        const winner = playerHands[0];

        setCelebratingWinner(true);
        playSound('winner');
        setWinningAmount(newState.pot);
        
        setGameState(prev => {
          const updatedPlayers = prev.players.map(p => 
            p.id === winner.player.id ? { ...p, chips: p.chips + prev.pot } : p
          );

          toast({
            title: `🎉 ${winner.player.name} wins!`,
            description: `${winner.hand.name} - Won ${prev.pot} chips`,
          });

          return { ...prev, players: updatedPlayers, pot: 0 };
        });

        setTimeout(() => {
          setGameState(prev => startNewHand(prev));
        }, 4000);
      }, 2000);
    }

    return newState;
  }

  const humanPlayer = gameState.players[0];
  const isPlayerTurn = gameState.activePlayerIndex === 0 && gameState.phase !== 'showdown';
  const callAmount = gameState.currentBet - humanPlayer.currentBet;
  const canCheck = callAmount === 0;

  // Enable keyboard shortcuts
  useKeyboardShortcuts({
    onAction: handlePlayerAction,
    disabled: !isPlayerTurn || isProcessing,
    canCheck,
    callAmount,
  });

  return (
    <div 
      className="min-h-screen flex flex-col items-end justify-end p-4 pb-8 pt-20 relative"
      style={{
        backgroundImage: `url(${clubGTable})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Table Header */}
      <TableHeader
        tableName="Imatra Poker - Table #1"
        handNumber={handNumber}
        smallBlind={SMALL_BLIND}
        bigBlind={BIG_BLIND}
      />
      
      <div className="w-full max-w-6xl relative z-10 mb-24">
        {/* Poker Table - Invisible container */}
        <div className="relative aspect-[16/10] p-8">
          {/* Left Players */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <div className="relative">
              <EnhancedPlayerPosition
                player={gameState.players[5]}
                isActive={gameState.players[gameState.activePlayerIndex]?.id === gameState.players[5].id}
                showCards={false}
              />
            </div>
          </div>
          
          {/* Top Left Player */}
          <div className="absolute top-12 left-[20%]">
            <div className="relative">
              <EnhancedPlayerPosition
                player={gameState.players[4]}
                isActive={gameState.players[gameState.activePlayerIndex]?.id === gameState.players[4].id}
                showCards={false}
              />
            </div>
          </div>
          
          {/* Top Right Player */}
          <div className="absolute top-12 right-1/4">
            <div className="relative">
              <EnhancedPlayerPosition
                player={gameState.players[3]}
                isActive={gameState.players[gameState.activePlayerIndex]?.id === gameState.players[3].id}
                showCards={false}
              />
            </div>
          </div>

          {/* Right Players */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <div className="relative">
              <EnhancedPlayerPosition
                player={gameState.players[2]}
                isActive={gameState.players[gameState.activePlayerIndex]?.id === gameState.players[2].id}
                showCards={false}
              />
            </div>
          </div>
          
          {/* Bottom Right Player */}
          <div className="absolute bottom-16 right-1/4">
            <div className="relative">
              <EnhancedPlayerPosition
                player={gameState.players[1]}
                isActive={gameState.players[gameState.activePlayerIndex]?.id === gameState.players[1].id}
                showCards={false}
              />
            </div>
          </div>

          {/* Center - Pot and Community Cards */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
            {/* Pot */}
            <div className={`bg-background/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-primary/50 transition-all ${celebratingWinner ? 'animate-winner-celebration' : ''}`}>
              <div className="flex items-center gap-2">
                <Circle className="w-5 h-5 fill-chip-gold text-chip-gold" />
                {celebratingWinner ? (
                  <span className="text-2xl font-bold text-chip-gold">Won: {winningAmount}</span>
                ) : (
                  <span className="text-2xl font-bold text-foreground">Pot: {gameState.pot}</span>
                )}
                {celebratingWinner && (
                  <Sparkles className="w-5 h-5 text-chip-gold animate-sparkle" />
                )}
              </div>
            </div>

            {/* Community Cards */}
            {gameState.communityCards.length > 0 && (
              <div className="flex gap-2">
                {gameState.communityCards.map((card, idx) => (
                  <div key={idx} className="animate-card-deal" style={{ animationDelay: `${idx * 150}ms` }}>
                    <Card card={card} delay={0} />
                  </div>
                ))}
              </div>
            )}

            {/* Phase Indicator */}
            <div className="text-sm text-foreground/70 uppercase tracking-wider font-semibold">
              {gameState.phase}
            </div>
          </div>

          {/* Bottom Left - Human Player */}
          <div className="absolute bottom-16 left-[20%]">
            <div className="relative">
              <EnhancedPlayerPosition
                player={humanPlayer}
                isActive={isPlayerTurn}
                showCards={true}
              />
            </div>
          </div>
        </div>

        {/* Betting Controls Drawer */}
        {gameState.phase !== 'showdown' && gameState.phase !== 'waiting' && (
          <BettingControls
            playerChips={humanPlayer.chips}
            currentBet={gameState.currentBet}
            playerCurrentBet={humanPlayer.currentBet}
            minimumRaise={gameState.bigBlind * 2}
            onAction={handlePlayerAction}
            disabled={!isPlayerTurn || isProcessing}
          />
        )}
      </div>
    </div>
  );
}
