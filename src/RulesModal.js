import React from 'react';

const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
       <div className="modal-content" onClick={e => e.stopPropagation()}>
       <div className="modal-header">
          <h2>Règles du Sabacc de Kessel</h2>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>Le jeu se joue à 4 joueurs. Vous misez des jetons (6 pour cet exemple) pour améliorer votre main et obtenir une paire, une main de Sabacc. Pour remporter une manche, vous devez avoir la meilleure main après trois tours. Le dernier joueur à posséder des jetons dans sa réserve remporte la partie et reçoit le contenu du pot de crédits.</p>

          <h3>Règles de base</h3>
          <ul>
            <li>Les mains sont constituées de deux cartes, une de chaque famille : le sable et le sang, avec une valeur allant de 1 à 6 points.</li>
            <li>La valeur de chaque carte est indiquée par son en-tête et son symbole central. Il y a trois cartes de chaque valeur par famille.</li>
            <li>L'objectif est de réduire la valeur de votre main, qui correspond à la différence entre les valeurs de vos cartes.</li>
            <li>Une main de Sabacc est une paire dont la différence des valeurs est nulle.</li>
          </ul>

          <h3>Valeur des mains</h3>
          <ul>
            <li>Le rang d'une main de Sabacc dépend de la différence entre les valeurs des cartes. Plus cette différence est proche de zéro, plus la main est forte.</li>
            <li>Lorsqu'un "sylop" est révélé, il adopte la même valeur que l'autre carte de votre main, formant ainsi une paire et une main de Sabacc. Chaque famille dispose d'un sylop.</li>
            <li>Lorsqu'un "imposteur" est révélé, il adopte la valeur de l'un des deux dés lancés, complétant ainsi votre main. Chaque famille dispose de trois imposteurs.</li>
            <li>Un Sabacc de Sylop ou d'imposteur équivaut à une main de Sabacc standard de même valeur.</li>
            <li>Une paire de sylops est appelée "Sabacc pur", qui est considérée comme la meilleure main du jeu.</li>
          </ul>

          <h3>Tour de jeu</h3>
          <ul>
            <li>Pour piocher une carte, vous devez dépenser un jeton. En passant votre tour, vous pouvez économiser vos jetons pour les utiliser quand vous aurez une bonne main.</li>
            <li>Vous pouvez piocher la carte au sommet de n'importe quelle pile sur la table, y compris les défausses.</li>
            <li>Après avoir pioché une carte de sable ou de sang, vous devez vous défausser d'une carte de la même famille, afin d'avoir toujours une carte de chaque famille dans votre main.</li>
            <li>Chaque manche dure 3 tours, vous offrant 3 opportunités d'améliorer votre main. À la fin des 3 tours, tous les joueurs révèlent leurs mains.</li>
            <li>Si tous les joueurs passent leur tour, ils doivent immédiatement révéler leurs mains.</li>
            <li>Vous remportez la manche si vous avez la meilleure main. En cas d'égalité, il peut y avoir plusieurs vainqueurs.</li>
            <li>Si personne n'a de main de Sabacc, la main ayant la différence de valeur la plus faible entre les cartes remporte la manche.</li>
          </ul>

          <h3>Gestion des jetons</h3>
          <ul>
            <li>Le vainqueur de la manche récupère les jetons qu'il avait misés et les replace dans sa réserve.</li>
            <li>Les joueurs sans main de Sabacc perdent un montant de jetons égal à la différence entre les valeurs de leurs cartes.</li>
            <li>Les joueurs avec une main de Sabacc perdante perdent un jeton de mise. Tous les jetons perdus sont retirés du jeu.</li>
            <li>Si votre réserve de jetons est vide à la fin de la phase de révélation des cartes, vous êtes éliminé de la partie.</li>
          </ul>

          <h3>Restrictions supplémentaires</h3>
          <ul>
            <li>Vous ne pouvez pas avoir deux cartes de sable ou deux cartes de sang dans votre main : une carte de chaque famille est requise.</li>
            <li>Avant de piocher, vous devez savoir quelles cartes sont visibles. Vous pouvez ensuite choisir de piocher une carte visible ou invisible, que ce soit du sable ou du sang.</li>
            <li>Si vous avez un imposteur à la fin de la manche, vous devez lancer deux dés, puis choisir le numéro correspondant à l'un des dés pour déterminer sa valeur.</li>
            <li>Lorsque vous choisissez une carte visible, vous devez savoir sa valeur avant de piocher.</li>
            <li>Si vous piochez une carte d'une famille, vous devez vous défausser d'une carte de cette même famille. Vous ne pouvez pas vous défausser de la carte de l'autre famille.</li>
          </ul>

          <p>Enfin, les cartes de sang sont toujours placées à droite et les cartes de sable à gauche dans votre main. Une fois que vous avez pioché, vous devez décider quelle carte défausser pour respecter cette configuration.</p>
        </div>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default RulesModal;