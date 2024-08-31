import React from 'react';
import Card from './Card';
import dos from './img/dos.png';

const GameBoard = ({ deck, handlePileClick }) => {
  return (
    <div className="game-board">
      <div className="deck-piles">
        <div className="deck-pile" onClick={() => handlePileClick('sandVisible')}>
          <h4>Pile Sable Visible</h4>
          {deck.sandVisible.length > 0 ? (
            <Card card={deck.sandVisible[deck.sandVisible.length - 1]} />
          ) : (
            <div>Aucune carte visible</div>
          )}
        </div>
        <div className="deck-pile" onClick={() => handlePileClick('sandInvisible')}>
          <h4>Pile Sable Invisible</h4>
          <img src={dos} alt="dos de carte" />
        </div>
        <div className="deck-pile" onClick={() => handlePileClick('bloodVisible')}>
          <h4>Pile Sang Visible</h4>
          {deck.bloodVisible.length > 0 ? (
            <Card card={deck.bloodVisible[deck.bloodVisible.length - 1]} />
          ) : (
            <div>Aucune carte visible</div>
          )}
        </div>
        <div className="deck-pile" onClick={() => handlePileClick('bloodInvisible')}>
          <h4>Pile Sang Invisible</h4>
          <img src={dos} alt="dos de carte" />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
