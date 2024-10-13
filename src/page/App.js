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

const App = () => {
  const initialTokens = 6;
  const totalTurnsPerManche = 3;

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
    if (players[playerIndex].tokens <= 0) {
      alert("Vous n'avez plus de jetons pour piocher.");
      return null;
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

    return drawnCard;
  };

  const nextPlayer = (playerPassed = false) => {
    let updatedPlayers = [...players];

    if (playerPassed) {
      setPassedPlayers(passedPlayers + 1);
    } else {
      updatedPlayers[currentPlayerIndex] = {
        ...updatedPlayers[currentPlayerIndex],
        turnsPlayed: updatedPlayers[currentPlayerIndex].turnsPlayed + 1,
      };
    }

    setPlayers(updatedPlayers);

    let activePlayers = getActivePlayers(updatedPlayers);

    if (passedPlayers >= activePlayers.length) {
      endRound();
      return;
    }

    const nextIndex = getNextPlayerIndex(currentPlayerIndex, updatedPlayers);

    if (nextIndex === currentPlayerIndex) {
      setGameOver(true);
      alert("La partie est terminée ! Il n'y a plus de joueurs actifs.");
      return;
    }

    setCurrentPlayerIndex(nextIndex);

    if (updatedPlayers[nextIndex].turnsPlayed >= totalTurnsPerManche) {
      endRound();
    } else {
      if (nextIndex === 0) {
        setCurrentTurn(currentTurn + 1);
      }
    }
  };

  const endRound = () => {
    const activePlayers = getActivePlayers(players);

    if (activePlayers.length === 0) {
      setGameOver(true);
      alert("La partie est terminée ! Tous les joueurs ont été éliminés.");
      return;
    }

    const evaluateHand = (player) => {
      if (!player.hand || !player.hand.sand || !player.hand.blood) {
        console.error("Main de joueur invalide:", player);
        return null;
      }

      let sandValue = player.hand.sand.value;
      let bloodValue = player.hand.blood.value;
      let isSabacc = false;
      let isSylopPair = false;
      let isImpostor = false;

      if (sandValue === "sylop" && bloodValue === "sylop") {
        isSylopPair = true;
        return { player, isSylopPair, value: Infinity, difference: 0 };
      }

      if (sandValue === "sylop") {
        sandValue = bloodValue;
      } else if (bloodValue === "sylop") {
        bloodValue = sandValue;
      }

      if (sandValue === "impostor" || bloodValue === "impostor") {
        isImpostor = true;
        player = applyImpostor(player);
        sandValue = player.hand.sand.value;
        bloodValue = player.hand.blood.value;
      }

      sandValue =
        typeof sandValue === "number" ? sandValue : parseInt(sandValue, 10);
      bloodValue =
        typeof bloodValue === "number" ? bloodValue : parseInt(bloodValue, 10);

      if (sandValue === bloodValue) {
        isSabacc = true;
      }

      const difference = Math.abs(sandValue - bloodValue);
      const value = Math.min(sandValue, bloodValue);

      return { player, difference, value, isSabacc, isSylopPair };
    };

    const handRankings = activePlayers
      .map(evaluateHand)
      .filter((hand) => hand !== null);

    if (handRankings.length === 0) {
      console.error("Aucune main valide trouvée");
      return;
    }

    handRankings.sort((a, b) => {
      if (a.isSylopPair && !b.isSylopPair) return -1;
      if (!a.isSylopPair && b.isSylopPair) return 1;
      if (a.isSabacc && b.isSabacc) return b.value - a.value;
      if (a.isSabacc) return -1;
      if (b.isSabacc) return 1;
      return a.difference - b.difference;
    });

    const winners = handRankings
      .filter(
        (hand) =>
          hand.isSylopPair === handRankings[0].isSylopPair &&
          hand.difference === handRankings[0].difference &&
          hand.isSabacc === handRankings[0].isSabacc &&
          hand.value === handRankings[0].value
      )
      .map((hand) => hand.player);

    const winnerNames = winners.map((winner) => winner.name).join(", ");
    let winningHandDescription;
    if (handRankings[0].isSylopPair) {
      winningHandDescription = "une paire de Sylop";
    } else if (handRankings[0].isSabacc) {
      winningHandDescription = `un Sabacc de ${handRankings[0].value}`;
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

      if (winners.includes(player)) {
        player.tokens += player.bet;
      } else {
        if (playerHand.isSabacc) {
          player.tokens -= 1;
        } else {
          player.tokens -= playerHand.difference;
        }
      }

      player.tokens = Math.max(0, player.tokens);
      if (player.tokens === 0) {
        return eliminatePlayer(player);
      }
      return player;
    });

    setPlayers(updatedPlayers);

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
  };

  const startNewRound = () => {
    setRound(round + 1);
    setCurrentTurn(1);

    const activePlayers = getActivePlayers(players);

    if (activePlayers.length <= 1) {
      setGameOver(true);
      if (activePlayers.length === 1) {
        alert(`${activePlayers[0].name} a remporté la partie !`);
      } else {
        alert("La partie est terminée ! Tous les joueurs ont été éliminés.");
      }
      return;
    }

    const nextIndex = getNextPlayerIndex(currentPlayerIndex, players);

    setCurrentPlayerIndex(nextIndex);
    setPassedPlayers(0);

    initializeGame(
      players,
      setPlayers,
      setDeck,
      setPassedPlayers,
      setCurrentTurn,
      setCurrentPlayerIndex
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
    </div>
  );
};

export default App;
