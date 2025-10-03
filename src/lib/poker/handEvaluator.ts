import { Card, Rank, HandRanking } from './types';

const rankValues: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

export function evaluateHand(cards: Card[]): HandRanking {
  if (cards.length < 5) {
    return { rank: 0, name: 'High Card', cards: [] };
  }

  // Get all possible 5-card combinations
  const combinations = getCombinations(cards, 5);
  let bestHand: HandRanking = { rank: 0, name: 'High Card', cards: [] };

  for (const combo of combinations) {
    const handRank = evaluateFiveCards(combo);
    if (handRank.rank > bestHand.rank) {
      bestHand = handRank;
    }
  }

  return bestHand;
}

function evaluateFiveCards(cards: Card[]): HandRanking {
  const sortedCards = [...cards].sort((a, b) => rankValues[b.rank] - rankValues[a.rank]);
  
  const isFlush = cards.every(card => card.suit === cards[0].suit);
  const isStraight = checkStraight(sortedCards);
  const rankCounts = getRankCounts(sortedCards);
  const counts = Object.values(rankCounts).sort((a, b) => b - a);

  // Royal Flush
  if (isFlush && isStraight && sortedCards[0].rank === 'A') {
    return { rank: 10, name: 'Royal Flush', cards: sortedCards };
  }

  // Straight Flush
  if (isFlush && isStraight) {
    return { rank: 9, name: 'Straight Flush', cards: sortedCards };
  }

  // Four of a Kind
  if (counts[0] === 4) {
    return { rank: 8, name: 'Four of a Kind', cards: sortedCards };
  }

  // Full House
  if (counts[0] === 3 && counts[1] === 2) {
    return { rank: 7, name: 'Full House', cards: sortedCards };
  }

  // Flush
  if (isFlush) {
    return { rank: 6, name: 'Flush', cards: sortedCards };
  }

  // Straight
  if (isStraight) {
    return { rank: 5, name: 'Straight', cards: sortedCards };
  }

  // Three of a Kind
  if (counts[0] === 3) {
    return { rank: 4, name: 'Three of a Kind', cards: sortedCards };
  }

  // Two Pair
  if (counts[0] === 2 && counts[1] === 2) {
    return { rank: 3, name: 'Two Pair', cards: sortedCards };
  }

  // One Pair
  if (counts[0] === 2) {
    return { rank: 2, name: 'One Pair', cards: sortedCards };
  }

  // High Card
  return { rank: 1, name: 'High Card', cards: sortedCards };
}

function checkStraight(sortedCards: Card[]): boolean {
  const values = sortedCards.map(card => rankValues[card.rank]);
  
  // Check regular straight
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] - values[i + 1] !== 1) {
      // Check for A-2-3-4-5 straight
      if (i === 0 && values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2) {
        return true;
      }
      return false;
    }
  }
  return true;
}

function getRankCounts(cards: Card[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const card of cards) {
    counts[card.rank] = (counts[card.rank] || 0) + 1;
  }
  return counts;
}

function getCombinations(arr: Card[], size: number): Card[][] {
  if (size > arr.length) return [];
  if (size === arr.length) return [arr];
  if (size === 1) return arr.map(item => [item]);

  const combinations: Card[][] = [];
  for (let i = 0; i < arr.length - size + 1; i++) {
    const head = arr[i];
    const tailCombinations = getCombinations(arr.slice(i + 1), size - 1);
    for (const tail of tailCombinations) {
      combinations.push([head, ...tail]);
    }
  }
  return combinations;
}

export function compareHands(hand1: HandRanking, hand2: HandRanking): number {
  if (hand1.rank !== hand2.rank) {
    return hand1.rank - hand2.rank;
  }

  // Compare high cards
  for (let i = 0; i < hand1.cards.length; i++) {
    const value1 = rankValues[hand1.cards[i].rank];
    const value2 = rankValues[hand2.cards[i].rank];
    if (value1 !== value2) {
      return value1 - value2;
    }
  }

  return 0; // Tie
}
