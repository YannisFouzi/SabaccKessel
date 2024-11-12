import React from "react";
import { getActivePlayers } from "../../utils/playerManager";
import PlayerHand from "../PlayerHand/PlayerHand";

const GameRenderer = ({
  players,
  currentPlayerIndex,
  drawnCard,
  handlePass,
  nextPlayer,
  deck,
  setDeck,
  setDrawnCard,
  setIsCardSelected,
}) => {
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

  return <div className="players-container">{renderPlayers()}</div>;
};

export default GameRenderer;
