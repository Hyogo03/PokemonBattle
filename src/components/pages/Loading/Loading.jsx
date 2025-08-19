import React from 'react'
import "./Loading.css"

export const Loading = () => {

  return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Now Loading...</p>
      </div>
  );
}
