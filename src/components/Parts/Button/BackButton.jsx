import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";

export const BackButton = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return <button onClick={handleBack} className="backButton">戻る</button>;
};
