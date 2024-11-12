import { useState } from "react";
import { createInitialPlayers } from "../utils/playerManager";

export const useGameState = (initialTokens = 6) => {
  const [impostorChoice, setImpostorChoice] = useState(null);
  const [isImpostorModalOpen, setIsImpostorModalOpen] = useState(false);
  const [isCardSelected, setIsCardSelected] = useState(false);
  const [players, setPlayers] = useState(createInitialPlayers(initialTokens));
  const [deck, setDeck] = useState({
    sandVisible: [],
    sandInvisible: [],
    bloodVisible: [],
    bloodInvisible: [],
  });
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [passedPlayers, setPassedPlayers] = useState(0);
  const [drawnCard, setDrawnCard] = useState(null);

  return {
    gameState: {
      impostorChoice,
      isImpostorModalOpen,
      isCardSelected,
      players,
      deck,
      isRulesModalOpen,
      currentPlayerIndex,
      round,
      currentTurn,
      gameOver,
      passedPlayers,
      drawnCard,
    },
    setters: {
      setImpostorChoice,
      setIsImpostorModalOpen,
      setIsCardSelected,
      setPlayers,
      setDeck,
      setIsRulesModalOpen,
      setCurrentPlayerIndex,
      setRound,
      setCurrentTurn,
      setGameOver,
      setPassedPlayers,
      setDrawnCard,
    },
  };
};
