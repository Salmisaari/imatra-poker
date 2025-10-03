import { Player, GameState, PlayerAction } from './types';
import { evaluateHand } from './handEvaluator';

export type AIPersonality = 'tight' | 'aggressive' | 'loose' | 'conservative';

export function getAIAction(
  player: Player,
  gameState: GameState,
  personality: AIPersonality = 'balanced' as any
): { action: PlayerAction; raiseAmount?: number } {
  const handStrength = evaluateHandStrength(player, gameState);
  const potOdds = calculatePotOdds(gameState, player);
  const amountToCall = gameState.currentBet - player.currentBet;

  // Randomize a bit for unpredictability
  const randomFactor = Math.random();

  // Can't bet more than chips
  if (amountToCall >= player.chips) {
    if (handStrength > 0.6 || (handStrength > 0.4 && randomFactor > 0.6)) {
      return { action: 'all-in' };
    }
    return { action: 'fold' };
  }

  // Strong hand
  if (handStrength > 0.75) {
    if (amountToCall === 0) {
      const raiseAmount = Math.min(
        Math.floor(gameState.pot * (0.5 + randomFactor * 0.5)),
        player.chips
      );
      return { action: 'raise', raiseAmount };
    }
    if (randomFactor > 0.3) {
      const raiseAmount = Math.min(
        gameState.currentBet + Math.floor(gameState.pot * 0.5),
        player.chips
      );
      return { action: 'raise', raiseAmount };
    }
    return { action: 'call' };
  }

  // Good hand
  if (handStrength > 0.5) {
    if (amountToCall === 0) {
      if (randomFactor > 0.5) {
        const raiseAmount = Math.min(
          Math.floor(gameState.bigBlind * (2 + randomFactor * 2)),
          player.chips
        );
        return { action: 'raise', raiseAmount };
      }
      return { action: 'check' };
    }
    if (potOdds > 0.3 || randomFactor > 0.7) {
      return { action: 'call' };
    }
    return { action: 'fold' };
  }

  // Medium hand
  if (handStrength > 0.3) {
    if (amountToCall === 0) {
      return { action: 'check' };
    }
    if (amountToCall < gameState.bigBlind * 2 && randomFactor > 0.5) {
      return { action: 'call' };
    }
    return { action: 'fold' };
  }

  // Weak hand
  if (amountToCall === 0) {
    return { action: 'check' };
  }
  if (amountToCall < gameState.bigBlind && randomFactor > 0.7) {
    return { action: 'call' };
  }
  return { action: 'fold' };
}

function evaluateHandStrength(player: Player, gameState: GameState): number {
  const allCards = [...player.holeCards, ...gameState.communityCards];
  
  if (allCards.length < 2) return 0.3;

  const hand = evaluateHand(allCards);
  
  // Map hand rank to strength (0-1)
  const strengthMap: Record<number, number> = {
    10: 1.0,   // Royal Flush
    9: 0.95,   // Straight Flush
    8: 0.9,    // Four of a Kind
    7: 0.85,   // Full House
    6: 0.75,   // Flush
    5: 0.65,   // Straight
    4: 0.55,   // Three of a Kind
    3: 0.45,   // Two Pair
    2: 0.35,   // One Pair
    1: 0.25,   // High Card
  };

  return strengthMap[hand.rank] || 0.25;
}

function calculatePotOdds(gameState: GameState, player: Player): number {
  const amountToCall = gameState.currentBet - player.currentBet;
  if (amountToCall === 0) return 1;
  return gameState.pot / (gameState.pot + amountToCall);
}
