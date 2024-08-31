import React from 'react';

const GameStatus = ({ round, turn, gameOver }) => {
  if (gameOver) {
    return <div>La partie est terminée.</div>;
  }

  return (
    <div className="game-status">
      <h2>Manche : {round}</h2>
      <h3>Tour : {turn}</h3>
    </div>
  );
};

export default GameStatus;
