import React from "react";
import "./BattleResult.css";

export const BattleResult = ({ winner, onRestart }) => {
  return (
    <div className="result-container">
      <h1 className="result-title">
        {winner === "player" ? "あなたの勝ち！" : "あなたの負け..."}
      </h1>
      <button className="result-button" onClick={onRestart}>
        もう一度バトル！
      </button>
    </div>
  );
};
