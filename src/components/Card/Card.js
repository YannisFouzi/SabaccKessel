import React from "react";
import dos from "../../assets/img/dos.png";
import sable_1 from "../../assets/img/sable_1.png";
import sable_2 from "../../assets/img/sable_2.png";
import sable_3 from "../../assets/img/sable_3.png";
import sable_4 from "../../assets/img/sable_4.png";
import sable_5 from "../../assets/img/sable_5.png";
import sable_6 from "../../assets/img/sable_6.png";
import sable_imposteur from "../../assets/img/sable_imposteur.png";
import sable_sylop from "../../assets/img/sable_sylop.png";
import sang_1 from "../../assets/img/sang_1.png";
import sang_2 from "../../assets/img/sang_2.png";
import sang_3 from "../../assets/img/sang_3.png";
import sang_4 from "../../assets/img/sang_4.png";
import sang_5 from "../../assets/img/sang_5.png";
import sang_6 from "../../assets/img/sang_6.png";
import sang_imposteur from "../../assets/img/sang_imposteur.png";
import sang_sylop from "../../assets/img/sang_sylop.png";
import "./Card.css";

const cardImages = {
  "sand-1": sable_1,
  "sand-2": sable_2,
  "sand-3": sable_3,
  "sand-4": sable_4,
  "sand-5": sable_5,
  "sand-6": sable_6,
  "sand-impostor": sable_imposteur,
  "sand-sylop": sable_sylop,
  "blood-1": sang_1,
  "blood-2": sang_2,
  "blood-3": sang_3,
  "blood-4": sang_4,
  "blood-5": sang_5,
  "blood-6": sang_6,
  "blood-impostor": sang_imposteur,
  "blood-sylop": sang_sylop,
  back: dos, // Image pour la pile invisible
};

const Card = ({ card }) => {
  // Vérifier si la carte est valide
  if (!card || !card.type || !card.value) {
    return (
      <div className="card">
        <img src={dos} alt="dos de carte" />
      </div>
    ); // Retourner une carte par défaut ou rien
  }

  return (
    <div className="card">
      <img
        src={cardImages[`${card.type}-${card.value}`]}
        alt={`${card.type} ${card.value}`}
      />
    </div>
  );
};

export default Card;
