import { useDrawCard } from "./useDrawCard";
import { useEndRound } from "./useEndRound";
import { useNextPlayer } from "./useNextPlayer";
import { useStartNewRound } from "./useStartNewRound";

export const useGameActions = (gameState, setters) => {
  const startNewRound = useStartNewRound(gameState, setters);
  const endRound = useEndRound(gameState, setters, startNewRound);
  const nextPlayer = useNextPlayer(gameState, setters, endRound);
  const drawCard = useDrawCard(gameState, setters, nextPlayer); // Ajout de nextPlayer ici

  return {
    drawCard,
    nextPlayer,
    endRound,
    startNewRound,
  };
};
