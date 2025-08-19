import React from "react";
import { useState } from "react";

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
    <button onClick={handleClick} disabled={disabled}>
      こうげき
    </button>
  );
};
