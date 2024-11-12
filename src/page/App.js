import React, { useEffect } from "react";
import Background from "../components/Background/Background";
import GameBoard from "../components/GameBoard/GameBoard";
import GameRenderer from "../components/GameRenderer/GameRenderer";
import GameStatus from "../components/GameStatus/GameStatus";
import RulesModal from "../components/RulesModal/RulesModal";
import { useGameActions } from "../hooks/useGameActions";
import { useGameState } from "../hooks/useGameState";
import { initializeGame } from "../utils/gamelogic";
import "./App.css";
import ImpostorChoiceModal from "./ImpostorChoiceModal";

const App = () => {
  const { gameState, setters } = useGameState(6);
  const gameActions = useGameActions(gameState, setters);

  useEffect(() => {
    initializeGame(
      gameState.players,
      setters.setPlayers,
      setters.setDeck,
      setters.setPassedPlayers,
      setters.setCurrentTurn,
      setters.setCurrentPlayerIndex
    );
  }, []);

  const handlePass = () => {
    setters.setIsCardSelected(false);
    gameActions.nextPlayer(true);
  };

  if (gameState.gameOver) {
    return (
      <div className="App">
        <h1>Sabacc de Kessel</h1>
        <GameStatus
          round={gameState.round}
          turn={gameState.currentTurn}
          gameOver={gameState.gameOver}
        />
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
        onClick={() => setters.setIsRulesModalOpen(true)}
      >
        Règles du jeu
      </button>
      <GameStatus round={gameState.round} turn={gameState.currentTurn} />
      <GameBoard
        deck={gameState.deck}
        drawCard={(pileType) => gameActions.drawCard(pileType)}
        isCardSelected={gameState.isCardSelected}
        setDrawnCard={setters.setDrawnCard}
        setIsCardSelected={setters.setIsCardSelected}
      />
      <GameRenderer
        players={gameState.players}
        currentPlayerIndex={gameState.currentPlayerIndex}
        drawnCard={gameState.drawnCard}
        handlePass={handlePass}
        nextPlayer={gameActions.nextPlayer}
        deck={gameState.deck}
        setDeck={setters.setDeck}
        setDrawnCard={setters.setDrawnCard}
        setIsCardSelected={setters.setIsCardSelected}
      />
      <RulesModal
        isOpen={gameState.isRulesModalOpen}
        onClose={() => setters.setIsRulesModalOpen(false)}
      />
      <ImpostorChoiceModal
        isOpen={gameState.isImpostorModalOpen}
        onClose={() => setters.setIsImpostorModalOpen(false)}
        playerName={
          gameState.impostorChoice ? gameState.impostorChoice.player.name : ""
        }
        diceRolls={
          gameState.impostorChoice ? gameState.impostorChoice.diceRolls : []
        }
        onChoice={
          gameState.impostorChoice
            ? gameState.impostorChoice.onChoice
            : () => {}
        }
      />
    </div>
  );
};

export default App;
