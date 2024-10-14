import React, { useEffect, useState } from "react";
import Background from "../components/Background/Background";
import GameBoard from "../components/GameBoard/GameBoard";
import GameStatus from "../components/GameStatus/GameStatus";
import PlayerHand from "../components/PlayerHand/PlayerHand";
import RulesModal from "../components/RulesModal/RulesModal";
import { applyImpostor, initializeGame } from "../utils/gamelogic";
import {
  createInitialPlayers,
  eliminatePlayer,
  getActivePlayers,
  getNextPlayerIndex,
  placePlayerBet,
} from "../utils/playerManager";
import "./App.css";
import ImpostorChoiceModal from "./ImpostorChoiceModal";

const App = () => {
  const initialTokens = 6;
  const totalTurnsPerManche = 3;
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

  useEffect(() => {
    initializeGame(
      players,
      setPlayers,
      setDeck,
      setPassedPlayers,
      setCurrentTurn,
      setCurrentPlayerIndex
    );
  }, []);

  const drawCard = (pileType, playerIndex) => {
    console.log(
      `Tentative de pioche pour ${players[playerIndex].name} dans la pile ${pileType}`
    );

    const player = players[playerIndex];

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
    updatedPlayers[playerIndex] = placePlayerBet(
      updatedPlayers[playerIndex],
      1
    );
    setPlayers(updatedPlayers);

    console.log(
      `${player.name} a tiré une carte : ${drawnCard.type} ${drawnCard.value}`
    );
    console.log(
      `Jetons restants pour ${player.name} : ${updatedPlayers[playerIndex].tokens}`
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
  };

  const nextPlayer = (playerPassed = false) => {
    console.log(
      "Début de nextPlayer. Joueur actuel:",
      players[currentPlayerIndex].name
    );

    let updatedPlayers = [...players];

    if (playerPassed) {
      setPassedPlayers((prevPassedPlayers) => prevPassedPlayers + 1);
      console.log(
        `${
          updatedPlayers[currentPlayerIndex].name
        } a passé. Total des joueurs passés: ${passedPlayers + 1}`
      );
    } else {
      updatedPlayers[currentPlayerIndex] = {
        ...updatedPlayers[currentPlayerIndex],
        turnsPlayed: updatedPlayers[currentPlayerIndex].turnsPlayed + 1,
      };
      console.log(
        `${
          updatedPlayers[currentPlayerIndex].name
        } a joué son tour. Tours joués: ${
          updatedPlayers[currentPlayerIndex].turnsPlayed + 1
        }`
      );
    }

    setPlayers(updatedPlayers);

    let activePlayers = getActivePlayers(updatedPlayers);
    console.log(
      "Joueurs actifs:",
      activePlayers.map((p) => p.name)
    );

    if (passedPlayers + (playerPassed ? 1 : 0) >= activePlayers.length) {
      console.log(
        "Tous les joueurs ont passé ou joué leurs tours. Fin de la manche."
      );
      endRound();
      return;
    }

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
    } while (
      updatedPlayers[nextIndex].eliminated ||
      updatedPlayers[nextIndex].tokens === 0
    );

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
  };

  const endRound = async () => {
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

    // Résoudre les cartes Impostor avant l'évaluation des mains
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

    if (handRankings.length === 0) {
      console.error("Aucune main valide trouvée");
      return;
    }

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

    console.log(
      "Gagnants de la manche :",
      winners.map((w) => w.name)
    );
    console.log(
      "Détails des gagnants:",
      winners.map((w) => ({ id: w.id, name: w.name }))
    );

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
      console.log("État complet du joueur:", JSON.stringify(player));
      console.log(
        "Avant mise à jour :",
        player.name,
        player.tokens,
        player.bet
      );

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

      console.log(
        `${player.name} est-il gagnant?`,
        winners.some((winner) => winner.id === player.id)
      );

      if (winners.some((winner) => winner.id === player.id)) {
        player.tokens += player.bet;
        console.log(
          `${player.name} gagne et récupère sa mise de ${player.bet}`
        );
      } else {
        if (playerHand.isSabacc) {
          player.tokens -= 1;
          console.log(`${player.name} a un Sabacc et perd 1 jeton`);
        } else {
          const lostTokens = playerHand.difference;
          player.tokens -= lostTokens;
          console.log(
            `${player.name} perd ${lostTokens} jetons (différence entre ses cartes)`
          );
        }
      }

      player.tokens = Math.max(0, player.tokens);
      player.bet = 0;

      console.log(
        "Après mise à jour :",
        player.name,
        player.tokens,
        player.bet
      );

      return player;
    });

    // Éliminer les joueurs qui n'ont plus de jetons
    const finalPlayers = updatedPlayers.map((player) =>
      player.tokens === 0 ? eliminatePlayer(player) : player
    );

    setPlayers(finalPlayers);
    console.log(
      "Après setPlayers :",
      finalPlayers.map(
        (p) =>
          `${p.name}: ${p.tokens} jetons, mise ${p.bet}, éliminé: ${p.eliminated}`
      )
    );

    const remainingPlayers = getActivePlayers(finalPlayers);
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
  };

  const startNewRound = () => {
    console.log(
      "Début de startNewRound :",
      players.map((p) => `${p.name}: ${p.tokens} jetons, mise ${p.bet}`)
    );

    // Incrémenter le numéro de la manche
    setRound(round + 1);

    // Réinitialiser le tour à 1
    setCurrentTurn(1);

    // Obtenir la liste des joueurs actifs
    const activePlayers = getActivePlayers(players);

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
    let nextIndex = getNextPlayerIndex(currentPlayerIndex, players);
    while (players[nextIndex].eliminated) {
      nextIndex = getNextPlayerIndex(nextIndex, players);
    }

    // Mettre à jour l'index du joueur courant
    setCurrentPlayerIndex(nextIndex);

    // Réinitialiser le nombre de joueurs passés
    setPassedPlayers(0);

    // Réinitialiser l'état de sélection de carte
    setIsCardSelected(false);

    // Réinitialiser la carte tirée
    setDrawnCard(null);

    // Mettre à jour l'état des joueurs
    const updatedPlayers = players.map((player) => ({
      ...player,
      turnsPlayed: 0,
      bet: 0,
      hand: { sand: null, blood: null },
    }));

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
      players[nextIndex].name
    );
  };

  const handlePass = () => {
    setIsCardSelected(false);
    nextPlayer(true);
  };

  const renderPlayers = () => {
    const activePlayers = getActivePlayers(players);
    const currentPlayer =
      activePlayers[currentPlayerIndex % activePlayers.length];
    const otherPlayers = activePlayers.filter(
      (player) => player.id !== currentPlayer.id
    );

    return (
      <>
        <div className="current-player">
          <PlayerHand
            key={currentPlayer.id}
            player={currentPlayer}
            isCurrent={true}
            drawnCard={drawnCard}
            handlePass={handlePass}
            nextPlayer={() => nextPlayer(false)}
            deck={deck}
            setDeck={setDeck}
            setDrawnCard={setDrawnCard}
            setIsCardSelected={setIsCardSelected}
          />
        </div>
        <div className="other-players">
          {otherPlayers.map((player) => (
            <PlayerHand
              key={player.id}
              player={player}
              isCurrent={false}
              drawnCard={null}
              handlePass={() => {}}
              nextPlayer={() => {}}
              deck={deck}
              setDeck={setDeck}
              setDrawnCard={setDrawnCard}
              setIsCardSelected={setIsCardSelected}
            />
          ))}
        </div>
      </>
    );
  };

  if (gameOver) {
    return (
      <div className="App">
        <h1>Sabacc de Kessel</h1>
        <GameStatus round={round} turn={currentTurn} gameOver={gameOver} />
        <h2>La partie est terminée !</h2>
      </div>
    );
  }
  return (
    <div className="App">
      <Background />
      <h1>Sabacc de Kessel</h1>
      <button
        className="rules-button"
        onClick={() => setIsRulesModalOpen(true)}
      >
        Règles du jeu
      </button>
      <GameStatus round={round} turn={currentTurn} />
      <GameBoard
        deck={deck}
        drawCard={(pileType) => drawCard(pileType, currentPlayerIndex)}
        isCardSelected={isCardSelected}
        setDrawnCard={setDrawnCard}
        setIsCardSelected={setIsCardSelected}
      />
      <div className="players-container">{renderPlayers()}</div>
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
      <ImpostorChoiceModal
        isOpen={isImpostorModalOpen}
        onClose={() => setIsImpostorModalOpen(false)}
        playerName={impostorChoice ? impostorChoice.player.name : ""}
        diceRolls={impostorChoice ? impostorChoice.diceRolls : []}
        onChoice={impostorChoice ? impostorChoice.onChoice : () => {}}
      />
    </div>
  );
};

export default App;
