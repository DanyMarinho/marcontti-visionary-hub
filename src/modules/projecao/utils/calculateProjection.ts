interface ActiveCard {
  value: number;
  conversionRate: number;
}

export function calculateProjection(closedSales: number, activeCards: ActiveCard[]) {
  const weightedValue = activeCards.reduce((acc, card) => {
    return acc + (card.value * (card.conversionRate / 100));
  }, 0);

  const realistic = closedSales + weightedValue;
  const pessimistic = realistic * 0.5;
  const optimistic = realistic * 1.5;

  return {
    pessimistic,
    realistic,
    optimistic
  };
}
