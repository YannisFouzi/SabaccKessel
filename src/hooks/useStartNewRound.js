import { useCallback } from "react";
import { initializeGame } from "../utils/gamelogic";
import { getActivePlayers, getNextPlayerIndex } from "../utils/playerManager";

export const useStartNewRound = (gameState, setters) => {
  const { players, round, currentPlayerIndex } = gameState;
  const {
    setPlayers,
    setDeck,
    setPassedPlayers,
    setCurrentTurn,
    setCurrentPlayerIndex,
    setGameOver,
    setRound,
    setIsCardSelected,
    setDrawnCard,
  } = setters;

  return useCallback(() => {
    console.log(
      "Début de startNewRound :",
      players.map((p) => `${p.name}: ${p.tokens} jetons, mise ${p.bet}`)
    );

    // Éliminer les joueurs à 0 jetons et réinitialiser les états pour la nouvelle manche
    const updatedPlayers = players.map((player) => ({
      ...player,
      eliminated:
        !player.eliminated && player.tokens === 0 ? true : player.eliminated,
      turnsPlayed: 0,
      bet: 0,
      hand: { sand: null, blood: null },
    }));

    setPlayers(updatedPlayers);

    // Incrémenter le numéro de la manche
    setRound(round + 1);

    // Réinitialiser le tour à 1
    setCurrentTurn(1);

    // Obtenir la liste des joueurs actifs
    const activePlayers = getActivePlayers(updatedPlayers);

    // Vérifier s'il reste suffisamment de joueurs pour continuer
    if (activePlayers.length <= 1) {
      setGameOver(true);
      if (activePlayers.length === 1) {
        alert(`${activePlayers[0].name} a remporté la partie !`);
      } else {
        alert("La partie est terminée ! Tous les joueurs ont été éliminés.");
      }
      return;
    }

    // Trouver le prochain joueur non éliminé pour commencer la manche
    let nextIndex = getNextPlayerIndex(currentPlayerIndex, updatedPlayers);
    while (updatedPlayers[nextIndex].eliminated) {
      nextIndex = getNextPlayerIndex(nextIndex, updatedPlayers);
    }

    // Mettre à jour l'index du joueur courant
    setCurrentPlayerIndex(nextIndex);

    // Réinitialiser le nombre de joueurs passés
    setPassedPlayers(0);

    // Réinitialiser l'état de sélection de carte
    setIsCardSelected(false);

    // Réinitialiser la carte tirée
    setDrawnCard(null);

    // Réinitialiser le jeu
    initializeGame(
      updatedPlayers,
      setPlayers,
      setDeck,
      setPassedPlayers,
      setCurrentTurn,
      setCurrentPlayerIndex
    );

    console.log(
      "Nouvelle manche commencée. Joueur actif :",
      updatedPlayers[nextIndex].name
    );
  }, [players, round, currentPlayerIndex]);
};
