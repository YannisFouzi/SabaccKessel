import { useCallback } from "react";
import { getActivePlayers } from "../utils/playerManager";

export const useNextPlayer = (gameState, setters, endRound) => {
  const {
    players,
    currentPlayerIndex,
    passedPlayers,
    currentTurn,
    totalTurnsPerManche = 3,
  } = gameState;

  const {
    setPlayers,
    setPassedPlayers,
    setCurrentPlayerIndex,
    setGameOver,
    setCurrentTurn,
    setIsCardSelected,
    setDrawnCard,
  } = setters;

  return useCallback(
    (playerPassed = false) => {
      console.log(
        "Début de nextPlayer. Joueur actuel:",
        players[currentPlayerIndex].name
      );

      let updatedPlayers = [...players];
      let activePlayers = getActivePlayers(updatedPlayers);

      if (playerPassed) {
        updatedPlayers[currentPlayerIndex] = {
          ...updatedPlayers[currentPlayerIndex],
          lastActionWasPass: true,
        };

        let consecutivePasses = 0;
        let checkIndex = currentPlayerIndex;
        let checkedPlayers = 0;

        while (checkedPlayers < activePlayers.length) {
          if (!updatedPlayers[checkIndex].eliminated) {
            if (updatedPlayers[checkIndex].lastActionWasPass) {
              consecutivePasses++;
            } else {
              break;
            }
            checkedPlayers++;
          }
          checkIndex =
            (checkIndex - 1 + updatedPlayers.length) % updatedPlayers.length;
        }

        setPassedPlayers(consecutivePasses);

        if (consecutivePasses === activePlayers.length) {
          console.log(
            "Tous les joueurs actifs ont passé consécutivement. Fin de la manche."
          );
          setPlayers(updatedPlayers);
          endRound();
          return;
        }
      } else {
        updatedPlayers[currentPlayerIndex] = {
          ...updatedPlayers[currentPlayerIndex],
          lastActionWasPass: false,
          turnsPlayed: updatedPlayers[currentPlayerIndex].turnsPlayed + 1,
        };
        setPassedPlayers(0);
      }

      setPlayers(updatedPlayers);

      let nextIndex = currentPlayerIndex;
      let attempts = 0;
      do {
        nextIndex = (nextIndex + 1) % updatedPlayers.length;
        attempts++;
        if (attempts > updatedPlayers.length) {
          console.error(
            "Impossible de trouver le prochain joueur actif. Fin de la partie."
          );
          setGameOver(true);
          return;
        }
      } while (updatedPlayers[nextIndex].eliminated);

      setCurrentPlayerIndex(nextIndex);
      console.log(`Prochain joueur: ${updatedPlayers[nextIndex].name}`);

      if (updatedPlayers[nextIndex].turnsPlayed >= totalTurnsPerManche) {
        console.log(
          `${updatedPlayers[nextIndex].name} a joué tous ses tours. Fin de la manche.`
        );
        endRound();
      } else {
        if (nextIndex === 0) {
          setCurrentTurn((prevTurn) => prevTurn + 1);
          console.log(`Nouveau tour commencé. Tour actuel: ${currentTurn + 1}`);
        }
      }

      setIsCardSelected(false);
      setDrawnCard(null);

      console.log(`Tour passé au joueur ${updatedPlayers[nextIndex].name}`);
    },
    [players, currentPlayerIndex, passedPlayers, currentTurn]
  );
};
