import React from "react";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return <button onClick={handleBack}>戻る</button>;
};
