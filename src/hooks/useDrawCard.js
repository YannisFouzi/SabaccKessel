import { useCallback } from "react";
import { placePlayerBet } from "../utils/playerManager";

export const useDrawCard = (gameState, setters, nextPlayer) => {
  // Ajout de nextPlayer ici
  const { players, deck, currentPlayerIndex } = gameState;
  const { setDeck, setPlayers, setIsCardSelected, setDrawnCard } = setters;

  return useCallback(
    (pileType) => {
      console.log(
        `Tentative de pioche pour ${players[currentPlayerIndex].name} dans la pile ${pileType}`
      );

      const player = players[currentPlayerIndex];

      if (player.eliminated) {
        console.error(
          `Tentative de pioche par un joueur éliminé : ${player.name}`
        );
        nextPlayer(true);
        return null;
      }

      if (player.tokens <= 0) {
        console.warn(`${player.name} n'a plus de jetons pour piocher.`);
        nextPlayer(true);
        return null;
      }

      if (deck[pileType].length === 0) {
        console.warn(
          `La pile ${pileType} est vide. Tentative de pioche dans une autre pile.`
        );
        const otherPiles = Object.keys(deck).filter(
          (pile) => pile !== pileType && deck[pile].length > 0
        );
        if (otherPiles.length === 0) {
          console.error("Toutes les piles sont vides. Impossible de piocher.");
          nextPlayer(true);
          return null;
        }
        pileType = otherPiles[Math.floor(Math.random() * otherPiles.length)];
        console.log(`Pioche dans la pile alternative : ${pileType}`);
      }

      const newDeck = { ...deck };
      const drawnCard = newDeck[pileType].pop();

      setDeck(newDeck);

      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex] = placePlayerBet(
        updatedPlayers[currentPlayerIndex],
        1
      );
      setPlayers(updatedPlayers);

      console.log(
        `${player.name} a tiré une carte : ${drawnCard.type} ${drawnCard.value}`
      );
      console.log(
        `Jetons restants pour ${player.name} : ${updatedPlayers[currentPlayerIndex].tokens}`
      );

      if (pileType.includes("Visible")) {
        if (newDeck[pileType.replace("Visible", "Invisible")].length > 0) {
          const newVisibleCard =
            newDeck[pileType.replace("Visible", "Invisible")].pop();
          newDeck[pileType].push(newVisibleCard);
          setDeck(newDeck);
          console.log(
            `Nouvelle carte visible dans la pile ${pileType} : ${newVisibleCard.type} ${newVisibleCard.value}`
          );
        } else {
          console.log(
            `Pas de carte disponible pour remplacer dans la pile ${pileType}`
          );
        }
      }

      setIsCardSelected(true);
      setDrawnCard(drawnCard);

      return drawnCard;
    },
    [players, currentPlayerIndex, deck]
  );
};
