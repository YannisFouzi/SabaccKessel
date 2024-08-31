import React from 'react';
import Card from './Card';

const PlayerHand = ({ player, isCurrent, discardCard, nextPlayer, drawnCard, handleKeepCard }) => {
  
  const handlePass = () => {
    nextPlayer(); // Le joueur passe son tour, on passe au joueur suivant
  };

  return (
    <div 
      className={`player-hand ${isCurrent ? 'current' : ''}`} 
      style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        width: '100%', 
        justifyContent: 'space-between' 
      }}
    >
      <div className="player-info" style={{ flex: 1, marginRight: '20px' }}>
        <h3>{player.name} (Jetons : {player.tokens})</h3>
        <p>Jetons misés : {player.bet}</p> {/* Affichage des jetons misés */}
        <div className="cards" style={{ display: 'flex', justifyContent: 'center' }}>
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
        <div className="actions" style={{ flex: 1, marginLeft: '20px' }}>
          <p>Vous avez pioché :</p>
          <Card card={drawnCard} />
          <p>Choisissez une carte à garder :</p>
          <button onClick={() => handleKeepCard(drawnCard, player.hand[drawnCard.type])}>
            Garder la carte piochée
          </button>
          <button onClick={() => handleKeepCard(player.hand[drawnCard.type], drawnCard)}>
            Garder la carte actuelle
          </button>
        </div>
      )}
    </div>
  );
  
  
  
};

export default PlayerHand;
