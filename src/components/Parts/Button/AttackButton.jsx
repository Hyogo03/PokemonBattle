import React from "react";
import { useState } from "react";
import "./AttackButton.css";

export const AttackButton = ({ onClick }) => {
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    setDisabled(true);
    if (onClick) {
      onClick();
    }

    console.log("クリックされました");

    setTimeout(() => {
      setDisabled(false);
    }, 2000);
  };
  return (
    <button onClick={handleClick} disabled={disabled} className="attackButton">
      こうげき
    </button>
  );
};
