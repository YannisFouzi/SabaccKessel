import { generateDeck } from "../components/Card/Card";

export const rollDice = () => {
  return [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
};

export const initializeGame = (
  players,
  setPlayers,
  setDeck,
  setPassedPlayers,
  setCurrentTurn,
  setCurrentPlayerIndex
) => {
  const { sandDeck, bloodDeck } = generateDeck();

  const sandVisible = [sandDeck.pop()];
  const sandInvisible = sandDeck;
  const bloodVisible = [bloodDeck.pop()];
  const bloodInvisible = bloodDeck;

  setDeck({
    sandVisible,
    sandInvisible,
    bloodVisible,
    bloodInvisible,
  });

  const updatedPlayers = players.map((player) => ({
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
  setCurrentPlayerIndex(0);
};

export const applyImpostor = (player) => {
  const diceRolls = rollDice();
  const chosenValue = window.prompt(
    `${player.name}, vous avez tiré un imposteur ! Les valeurs des dés sont ${diceRolls[0]} et ${diceRolls[1]}. Choisissez une valeur.`
  );

  if (player.hand.sand.value === "impostor") {
    player.hand.sand.value = parseInt(chosenValue, 10);
  } else if (player.hand.blood.value === "impostor") {
    player.hand.blood.value = parseInt(chosenValue, 10);
  }
};

export const calculateDifference = (player) => {
  let sandValue = player.hand.sand.value;
  let bloodValue = player.hand.blood.value;

  if (sandValue === "sylop") {
    sandValue = bloodValue;
  } else if (bloodValue === "sylop") {
    bloodValue = sandValue;
  }

  sandValue = isNaN(sandValue) ? 0 : sandValue;
  bloodValue = isNaN(bloodValue) ? 0 : bloodValue;

  if (sandValue === bloodValue) {
    player.sabacc = true;
    return 0;
  }

  player.sabacc = false;
  return Math.abs(sandValue - bloodValue);
};
