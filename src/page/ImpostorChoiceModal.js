import React from "react";
import "./ImpostorChoiceModal.css";

const ImpostorChoiceModal = ({
  isOpen,
  onClose,
  playerName,
  diceRolls,
  onChoice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content">
        <h2>{playerName}, vous avez tiré un Impostor !</h2>
        <p>
          Les valeurs des dés sont {diceRolls[0]} et {diceRolls[1]}.
        </p>
        <p>Choisissez une valeur :</p>
        <div className="button-container">
          <button
            className="choice-button"
            onClick={() => onChoice(diceRolls[0])}
          >
            {diceRolls[0]}
          </button>
          <button
            className="choice-button"
            onClick={() => onChoice(diceRolls[1])}
          >
            {diceRolls[1]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImpostorChoiceModal;
