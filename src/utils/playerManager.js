export const createInitialPlayers = (initialTokens) => {
  return [
    {
      id: 1,
      name: "Vous",
      tokens: initialTokens,
      hand: { sand: null, blood: null },
      turnsPlayed: 0,
      sabacc: false,
      bet: 0,
      eliminated: false,
    },
    {
      id: 2,
      name: "Joueur 2",
      tokens: initialTokens,
      hand: { sand: null, blood: null },
      turnsPlayed: 0,
      sabacc: false,
      bet: 0,
      eliminated: false,
    },
    {
      id: 3,
      name: "Joueur 3",
      tokens: initialTokens,
      hand: { sand: null, blood: null },
      turnsPlayed: 0,
      sabacc: false,
      bet: 0,
      eliminated: false,
    },
    {
      id: 4,
      name: "Joueur 4",
      tokens: initialTokens,
      hand: { sand: null, blood: null },
      turnsPlayed: 0,
      sabacc: false,
      bet: 0,
      eliminated: false,
    },
  ];
};

export const updatePlayerHand = (player, newHand) => {
  return { ...player, hand: newHand };
};

export const placePlayerBet = (player, betAmount) => {
  return {
    ...player,
    tokens: Math.max(0, player.tokens - betAmount), // Permet de descendre à zéro sans éliminer
    bet: player.bet + betAmount,
  };
};

export const eliminatePlayer = (player) => {
  return { ...player, eliminated: true, tokens: 0 };
};

export const resetPlayerForNewRound = (player, newHand) => {
  return {
    ...player,
    hand: newHand,
    turnsPlayed: 0,
    sabacc: false,
    bet: 0,
  };
};

export const getActivePlayers = (players) => {
  return players.filter((player) => !player.eliminated);
};

export const getNextPlayerIndex = (currentIndex, players) => {
  let nextIndex = currentIndex;
  do {
    nextIndex = (nextIndex + 1) % players.length;
  } while (players[nextIndex].eliminated);
  return nextIndex;
};
