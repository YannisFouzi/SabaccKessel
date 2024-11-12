import { useCallback } from "react";
import { applyImpostor } from "../utils/gamelogic";
import { getActivePlayers } from "../utils/playerManager";

export const useEndRound = (gameState, setters, startNewRound) => {
  const { players } = gameState;
  const { setPlayers, setGameOver, setImpostorChoice, setIsImpostorModalOpen } =
    setters;

  const handleImpostorChoice = (impostorData) => {
    return new Promise((resolve) => {
      setImpostorChoice(impostorData);
      setIsImpostorModalOpen(true);
      const handleChoice = (chosenValue) => {
        setIsImpostorModalOpen(false);
        const updatedPlayer = { ...impostorData.player };
        updatedPlayer.hand[impostorData.cardType].value = chosenValue;
        resolve(updatedPlayer);
      };
      setImpostorChoice({ ...impostorData, onChoice: handleChoice });
    });
  };

  const resolveImpostors = async (player) => {
    let updatedPlayer = { ...player };
    if (updatedPlayer.hand.sand.value === "impostor") {
      const result = applyImpostor(updatedPlayer, "sand");
      updatedPlayer = await handleImpostorChoice(result);
    }
    if (updatedPlayer.hand.blood.value === "impostor") {
      const result = applyImpostor(updatedPlayer, "blood");
      updatedPlayer = await handleImpostorChoice(result);
    }
    return updatedPlayer;
  };

  return useCallback(async () => {
    console.log("Début de endRound");
    const activePlayers = getActivePlayers(players);
    console.log(
      "Joueurs actifs au début de la manche :",
      activePlayers.map((p) => `${p.name}: ${p.tokens} jetons, mise ${p.bet}`)
    );

    if (activePlayers.length === 0) {
      setGameOver(true);
      alert("La partie est terminée ! Tous les joueurs ont été éliminés.");
      return;
    }

    const playersWithResolvedHands = await Promise.all(
      activePlayers.map(resolveImpostors)
    );

    const evaluateHand = (player) => {
      if (!player.hand || !player.hand.sand || !player.hand.blood) {
        console.error("Main de joueur invalide:", player);
        return null;
      }

      let sandValue = player.hand.sand.value;
      let bloodValue = player.hand.blood.value;
      let isSabacc = false;
      let isSylopPair = false;
      let isPair = false;

      if (sandValue === "sylop" && bloodValue === "sylop") {
        isSylopPair = true;
        return { player, isSylopPair, value: -1, difference: 0 };
      }

      if (sandValue === "sylop") {
        sandValue = bloodValue;
        isPair = true;
      } else if (bloodValue === "sylop") {
        bloodValue = sandValue;
        isPair = true;
      }

      sandValue =
        typeof sandValue === "number" ? sandValue : parseInt(sandValue, 10);
      bloodValue =
        typeof bloodValue === "number" ? bloodValue : parseInt(bloodValue, 10);

      if (sandValue === bloodValue) {
        isPair = true;
        isSabacc = true;
      }

      const difference = Math.abs(sandValue - bloodValue);
      const value = isPair
        ? Math.min(sandValue, bloodValue)
        : Math.max(sandValue, bloodValue);

      return { player, difference, value, isSabacc, isSylopPair, isPair };
    };

    const handRankings = playersWithResolvedHands
      .map(evaluateHand)
      .filter((hand) => hand !== null);

    handRankings.sort((a, b) => {
      if (a.isSylopPair && !b.isSylopPair) return -1;
      if (!a.isSylopPair && b.isSylopPair) return 1;
      if (a.isPair && !b.isPair) return -1;
      if (!a.isPair && b.isPair) return 1;
      if (a.isPair && b.isPair) return a.value - b.value;
      return a.difference - b.difference;
    });

    const winners = handRankings
      .filter(
        (hand) =>
          hand.isSylopPair === handRankings[0].isSylopPair &&
          hand.isPair === handRankings[0].isPair &&
          hand.difference === handRankings[0].difference &&
          hand.value === handRankings[0].value
      )
      .map((hand) => hand.player);

    const winnerNames = winners.map((winner) => winner.name).join(", ");
    let winningHandDescription;
    if (handRankings[0].isSylopPair) {
      winningHandDescription = "une paire de Sylop";
    } else if (handRankings[0].isPair) {
      winningHandDescription = `une paire de ${handRankings[0].value}`;
    } else {
      winningHandDescription = `une différence de ${handRankings[0].difference}`;
    }

    alert(
      `Les gagnants de la manche sont : ${winnerNames} avec ${winningHandDescription} !`
    );

    const updatedPlayers = players.map((player) => {
      if (player.eliminated) {
        return player;
      }

      const playerHand = handRankings.find(
        (hand) => hand.player.id === player.id
      );
      if (!playerHand) {
        console.error("Main non trouvée pour le joueur:", player);
        return player;
      }

      if (winners.some((winner) => winner.id === player.id)) {
        player.tokens += player.bet;
      } else {
        player.tokens -= playerHand.isSabacc ? 1 : playerHand.difference;
      }

      player.tokens = Math.max(0, player.tokens);
      player.bet = 0;

      return player;
    });

    setPlayers(updatedPlayers);

    // On vérifie s'il reste des joueurs actifs pour continuer la partie
    const remainingPlayers = getActivePlayers(updatedPlayers);
    if (remainingPlayers.length <= 1) {
      setGameOver(true);
      if (remainingPlayers.length === 1) {
        alert(`${remainingPlayers[0].name} a remporté la partie !`);
      } else {
        alert("La partie est terminée ! Tous les joueurs ont été éliminés.");
      }
      return;
    }

    startNewRound();
  }, [players]);
};
