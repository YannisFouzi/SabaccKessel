import React from "react";
import dos from "../../assets/img/dos.png";
import Card from "../Card/Card";
import "./GameBoard.css";

const GameBoard = ({
  deck,
  drawCard,
  isCardSelected,
  setDrawnCard,
  setIsCardSelected,
}) => {
  const handlePileClick = (pileType) => {
    if (isCardSelected) {
      alert(
        "Vous avez déjà sélectionné une carte, vous ne pouvez pas en sélectionner une autre."
      );
      return;
    }

    const card = drawCard(pileType);
    if (card) {
      setDrawnCard(card);
      setIsCardSelected(true);
    }
  };

  return (
    <div className="game-board">
      <div className="deck-piles">
        <div
          className="deck-pile"
          onClick={() => handlePileClick("sandVisible")}
        >
          <h4>Pile Sable Visible</h4>
          {deck.sandVisible.length > 0 ? (
            <Card card={deck.sandVisible[deck.sandVisible.length - 1]} />
          ) : (
            <div>Aucune carte visible</div>
          )}
        </div>
        <div
          className="deck-pile"
          onClick={() => handlePileClick("sandInvisible")}
        >
          <h4>Pile Sable Invisible</h4>
          <img src={dos} alt="dos de carte" />
        </div>
        <div
          className="deck-pile"
          onClick={() => handlePileClick("bloodVisible")}
        >
          <h4>Pile Sang Visible</h4>
          {deck.bloodVisible.length > 0 ? (
            <Card card={deck.bloodVisible[deck.bloodVisible.length - 1]} />
          ) : (
            <div>Aucune carte visible</div>
          )}
        </div>
        <div
          className="deck-pile"
          onClick={() => handlePileClick("bloodInvisible")}
        >
          <h4>Pile Sang Invisible</h4>
          <img src={dos} alt="dos de carte" />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
