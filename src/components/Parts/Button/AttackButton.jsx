import React from "react";
import { useState } from "react";
import "./AttackButton.css";

export const AttackButton = ({ onAttack, onMove }) => {
  const [disabled, setDisabled] = useState(false);

  const handleClick = (move) => {
    setDisabled(true);
    onAttack(move);

    setTimeout(() => {
      setDisabled(false);
    }, 2000);
  };

  return (
    <>
      {onMove.map((move, i) => (
        <button
          key={i}
          onClick={() => handleClick(move)}
          disabled={disabled}
          className="attackButton"
        >
          {move}
        </button>
      ))}
    </>
  );
};
