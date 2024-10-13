import React from "react";
import Card from "../Card/Card";
import "./PlayerHand.css";

const PlayerHand = ({
  player,
  isCurrent,
  nextPlayer,
  drawnCard,
  handlePass,
  deck,
  setDeck,
  setDrawnCard,
  setIsCardSelected,
}) => {
  const discardCard = (card) => {
    const newDeck = { ...deck };
    if (card.type === "sand") {
      newDeck.sandVisible.pop();
      newDeck.sandVisible.push(card);
    } else {
      newDeck.bloodVisible.pop();
      newDeck.bloodVisible.push(card);
    }
    setDeck(newDeck);
  };

  const handleKeepCard = (cardToKeep, cardToDiscard) => {
    player.hand[cardToKeep.type] = cardToKeep;
    discardCard(cardToDiscard);
    setDrawnCard(null);
    setIsCardSelected(false);
    nextPlayer();
  };

  return (
    <div
      className={`player-hand ${isCurrent ? "current" : ""}`}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <div className="player-info" style={{ flex: 1, marginRight: "20px" }}>
        <h3>
          {player.name} (Jetons : {player.tokens})
        </h3>
        <p>Jetons misés : {player.bet}</p>
        <div
          className="cards"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card card={player.hand.sand} />
          <Card card={player.hand.blood} />
        </div>
        {isCurrent && !drawnCard && (
          <div className="actions">
            <button onClick={handlePass}>Passer</button>
          </div>
        )}
      </div>
      {isCurrent && drawnCard && (
        <div className="actions" style={{ flex: 1, marginLeft: "20px" }}>
          <p>Vous avez pioché :</p>
          <Card card={drawnCard} />
          <p>Choisissez une carte à garder :</p>
          <button
            onClick={() =>
              handleKeepCard(drawnCard, player.hand[drawnCard.type])
            }
          >
            Garder la carte piochée
          </button>
          <button
            onClick={() =>
              handleKeepCard(player.hand[drawnCard.type], drawnCard)
            }
          >
            Garder la carte actuelle
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerHand;
