import React, { useState, useEffect } from 'react';
import PlayerHand from './PlayerHand';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import RulesModal from './RulesModal';
import './App.css';

const generateDeck = () => {
  const sandDeck = [];
  const bloodDeck = [];

  for (let i = 1; i <= 6; i++) {
    for (let j = 0; j < 5; j++) {
      sandDeck.push({ id: `sand-${i}-${j}`, type: 'sand', value: i });
      bloodDeck.push({ id: `blood-${i}-${j}`, type: 'blood', value: i });
    }
  }

  sandDeck.push({ id: `sand-sylop`, type: 'sand', value: 'sylop' });
  sandDeck.push({ id: `sand-impostor`, type: 'sand', value: 'impostor' });

  bloodDeck.push({ id: `blood-sylop`, type: 'blood', value: 'sylop' });
  bloodDeck.push({ id: `blood-impostor`, type: 'blood', value: 'impostor' });

  return {
    sandDeck: shuffleArray(sandDeck),
    bloodDeck: shuffleArray(bloodDeck),
  };
};

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const rollDice = () => {
  return [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
};

const App = () => {
  const initialTokens = 6;
  const totalTurnsPerManche = 3;
  const [players, setPlayers] = useState([
    { id: 1, name: 'Vous', tokens: initialTokens, hand: { sand: null, blood: null }, turnsPlayed: 0, sabacc: false, bet: 0, eliminated: false },
    { id: 2, name: 'Joueur 2', tokens: initialTokens, hand: { sand: null, blood: null }, turnsPlayed: 0, sabacc: false, bet: 0, eliminated: false },
    { id: 3, name: 'Joueur 3', tokens: initialTokens, hand: { sand: null, blood: null }, turnsPlayed: 0, sabacc: false, bet: 0, eliminated: false },
    { id: 4, name: 'Joueur 4', tokens: initialTokens, hand: { sand: null, blood: null }, turnsPlayed: 0, sabacc: false, bet: 0, eliminated: false },
  ]);

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
    initializeGame();
  }, []);

  const initializeGame = () => {
    const { sandDeck, bloodDeck } = generateDeck();

    const sandVisible = [sandDeck.pop()];
    const sandInvisible = sandDeck.splice(0, 14);
    const bloodVisible = [bloodDeck.pop()];
    const bloodInvisible = bloodDeck.splice(0, 14);

    setDeck({
      sandVisible,
      sandInvisible,
      bloodVisible,
      bloodInvisible,
    });

    const updatedPlayers = players.map(player => ({
      ...player,
      hand: {
        sand: sandInvisible.pop(),
        blood: bloodInvisible.pop(),
      },
      turnsPlayed: 0,
      sabacc: false,
      bet: 0,
      eliminated: false,
    }));

    setPlayers(updatedPlayers);
    setPassedPlayers(0);
    setCurrentTurn(1);
    setCurrentPlayerIndex(0);  // Commencez avec le premier joueur actif
  };

  const drawCard = (pileType, playerIndex) => {
    if (players[playerIndex].tokens <= 0) {
      alert('Vous n\'avez plus de jetons pour piocher.');
      return null;
    }

    const newDeck = { ...deck };
    const drawnCard = newDeck[pileType].pop();
    setDeck(newDeck);

    const updatedPlayers = [...players];
    updatedPlayers[playerIndex].tokens -= 1;
    updatedPlayers[playerIndex].bet += 1;
    setPlayers(updatedPlayers);

    return drawnCard;
  };

  const handlePileClick = (pileType) => {
    const card = drawCard(pileType, currentPlayerIndex);
    if (card) {
      setDrawnCard(card);
    }
  };

  const handleKeepCard = (cardToKeep, cardToDiscard) => {
    const currentPlayer = players[currentPlayerIndex];
    currentPlayer.hand[cardToKeep.type] = cardToKeep;
    discardCard(cardToDiscard, currentPlayerIndex);
    setDrawnCard(null);
    nextPlayer();
  };

  const discardCard = (card, playerIndex) => {
    if (card.type === 'sand') {
      deck.sandVisible.pop();
      deck.sandVisible.push(card);
    } else {
      deck.bloodVisible.pop();
      deck.bloodVisible.push(card);
    }
    setDeck({ ...deck });
  };

  const nextPlayer = (playerPassed = false) => {
    let updatedPlayers = [...players];

    if (playerPassed) {
      setPassedPlayers(passedPlayers + 1);
    } else {
      updatedPlayers[currentPlayerIndex].turnsPlayed += 1;
    }

    setPlayers(updatedPlayers);

    let activePlayers = updatedPlayers.filter(player => !player.eliminated && player.tokens > 0);
    
    if (passedPlayers >= activePlayers.length) {
      endRound();
      return;
    }

    let nextIndex = currentPlayerIndex;
    let loopCount = 0;

    do {
      nextIndex = (nextIndex + 1) % players.length;
      loopCount++;

      if (loopCount > players.length) {
        // Si nous avons fait le tour complet sans trouver de joueur actif, on termine la partie
        setGameOver(true);
        alert("La partie est terminée ! Il n'y a plus de joueurs actifs.");
        return;
      }
    } while (players[nextIndex].eliminated);

    setCurrentPlayerIndex(nextIndex);

    if (updatedPlayers[nextIndex].turnsPlayed >= totalTurnsPerManche) {
      endRound();
    } else {
      if (nextIndex === 0) {
        setCurrentTurn(currentTurn + 1);
      }
    }
  };

  const applyImpostor = (player) => {
    const diceRolls = rollDice();
    const chosenValue = window.prompt(
      `${player.name}, vous avez tiré un imposteur ! Les valeurs des dés sont ${diceRolls[0]} et ${diceRolls[1]}. Choisissez une valeur.`
    );

    if (player.hand.sand.value === 'impostor') {
      player.hand.sand.value = parseInt(chosenValue, 10);
    } else if (player.hand.blood.value === 'impostor') {
      player.hand.blood.value = parseInt(chosenValue, 10);
    }
  };

  const calculateDifference = (player) => {
    let sandValue = player.hand.sand.value;
    let bloodValue = player.hand.blood.value;
  
    // Si l'une des cartes est un Sylop, elle adopte la valeur de l'autre carte
    if (sandValue === 'sylop') {
      sandValue = bloodValue;  // Le Sylop adopte la valeur de la carte de sang
    } else if (bloodValue === 'sylop') {
      bloodValue = sandValue;  // Le Sylop adopte la valeur de la carte de sable
    }
  
    // Si les valeurs sont toujours nulles ou non numériques, les ignorer
    sandValue = isNaN(sandValue) ? 0 : sandValue;
    bloodValue = isNaN(bloodValue) ? 0 : bloodValue;
  
    // Si les deux cartes ont la même valeur, c'est une main de Sabacc
    if (sandValue === bloodValue) {
      player.sabacc = true;
      return 0; // Une paire parfaite de Sabacc
    }
  
    // Sinon, calculer la différence normale
    player.sabacc = false;
    return Math.abs(sandValue - bloodValue);
  };

  const endRound = () => {
    const activePlayers = players.filter((player) => !player.eliminated);
    
    if (activePlayers.length === 0) {
      setGameOver(true);
      alert("La partie est terminée ! Tous les joueurs ont été éliminés.");
      return;
    }
  
    const evaluateHand = (player) => {
      if (!player.hand || !player.hand.sand || !player.hand.blood) {
        console.error('Main de joueur invalide:', player);
        return null;
      }
    
      let sandValue = player.hand.sand.value;
      let bloodValue = player.hand.blood.value;
      let isSabacc = false;
      let isSylop = false;
      let isImpostor = false;
  
      // Gestion des Sylops
      if (sandValue === 'sylop') {
        sandValue = bloodValue;
        isSylop = true;
      } else if (bloodValue === 'sylop') {
        bloodValue = sandValue;
        isSylop = true;
      }
  
      // Gestion des Imposteurs
      if (sandValue === 'impostor' || bloodValue === 'impostor') {
        isImpostor = true;
        const diceRoll = Math.ceil(Math.random() * 6);
        if (sandValue === 'impostor') {
          sandValue = diceRoll;
        } else {
          bloodValue = diceRoll;
        }
      }
  
      // Conversion en nombres
      sandValue = typeof sandValue === 'number' ? sandValue : parseInt(sandValue, 10);
      bloodValue = typeof bloodValue === 'number' ? bloodValue : parseInt(bloodValue, 10);
  
      // Vérification de Sabacc
      if (sandValue === bloodValue) {
        isSabacc = true;
      }
      
      const difference = Math.abs(sandValue - bloodValue);
      const value = Math.min(sandValue, bloodValue);
  
      return {
        player,
        difference,
        value,
        isSabacc,
        isSylop
      };
    };
    
    const handRankings = activePlayers.map(evaluateHand).filter(hand => hand !== null);
  
    if (handRankings.length === 0) {
      console.error('Aucune main valide trouvée');
      return;
    }
    
    // Tri des mains
    handRankings.sort((a, b) => {
      if (a.isSabacc && b.isSabacc) {
        return a.value - b.value;
      }
      if (a.isSabacc) return -1;
      if (b.isSabacc) return 1;
      return a.difference - b.difference;
    });
    
    const winners = handRankings.filter(hand => 
      hand.difference === handRankings[0].difference && 
      hand.isSabacc === handRankings[0].isSabacc &&
      hand.value === handRankings[0].value
    ).map(hand => hand.player);
    
    const winnerNames = winners.map(winner => winner.name).join(', ');
    const winningHandDescription = handRankings[0].isSabacc 
      ? `Sabacc de ${handRankings[0].value}` 
      : `différence de ${handRankings[0].difference}`;
    
    alert(`Les gagnants de la manche sont : ${winnerNames} avec un ${winningHandDescription} !`);
  
    const updatedPlayers = players.map(player => {
      if (player.eliminated) {
        return player;
      }
  
      const playerHand = handRankings.find(hand => hand.player.id === player.id);
      if (!playerHand) {
        console.error('Main non trouvée pour le joueur:', player);
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
  
      player.tokens = Math.max(0, player.tokens); // Assure que les jetons ne sont jamais négatifs
      player.eliminated = player.tokens === 0;
  
      return player;
    });
  
    setPlayers(updatedPlayers);
  
    // Vérifier si la partie doit se terminer
    const remainingPlayers = updatedPlayers.filter(player => !player.eliminated);
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
  
    const activePlayers = players.filter(player => !player.eliminated);
    
    if (activePlayers.length <= 1) {
      setGameOver(true);
      if (activePlayers.length === 1) {
        alert(`${activePlayers[0].name} a remporté la partie !`);
      } else {
        alert("La partie est terminée ! Tous les joueurs ont été éliminés.");
      }
      return;
    }

    let nextIndex = currentPlayerIndex;
    do {
      nextIndex = (nextIndex + 1) % players.length;
    } while (players[nextIndex].eliminated);
    
    setCurrentPlayerIndex(nextIndex);
    setPassedPlayers(0);

    const { sandDeck, bloodDeck } = generateDeck();
    const sandVisible = [sandDeck.pop()];
    const sandInvisible = sandDeck.splice(0, 14);
    const bloodVisible = [bloodDeck.pop()];
    const bloodInvisible = bloodDeck.splice(0, 14);

    setDeck({
      sandVisible,
      sandInvisible,
      bloodVisible,
      bloodInvisible,
    });

    const newPlayers = players.map((player) => {
      if (!player.eliminated && player.tokens > 0) {
        return {
          ...player,
          hand: {
            sand: sandInvisible.pop(),
            blood: bloodInvisible.pop(),
          },
          turnsPlayed: 0,
          sabacc: false,
          bet: 0,
        };
      }
      return player;
    });
    setPlayers(newPlayers);
  };

  const renderPlayers = () => {
    const activePlayers = players.filter(player => !player.eliminated);
    const currentPlayer = activePlayers[currentPlayerIndex % activePlayers.length];
    const otherPlayers = activePlayers.filter(player => player.id !== currentPlayer.id);

    return (
      <>
        <div className="current-player">
          <PlayerHand
            key={currentPlayer.id}
            player={currentPlayer}
            isCurrent={true}
            drawnCard={drawnCard}
            handleKeepCard={handleKeepCard}
            nextPlayer={() => nextPlayer(false)}
          />
        </div>
        <div className="other-players">
          {otherPlayers.map((player) => (
            <PlayerHand
              key={player.id}
              player={player}
              isCurrent={false}
              drawnCard={null}
              handleKeepCard={() => {}}
              nextPlayer={() => nextPlayer(false)}
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
      <h1>Sabacc de Kessel</h1>
      <button className="rules-button" onClick={() => setIsRulesModalOpen(true)}>
        Règles du jeu
      </button>
      <GameStatus round={round} turn={currentTurn} />
      <GameBoard deck={deck} handlePileClick={handlePileClick} />
      <div className="players-container">
        {renderPlayers()}
      </div>
      <RulesModal 
        isOpen={isRulesModalOpen} 
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
};

export default App;
