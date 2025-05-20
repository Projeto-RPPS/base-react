import React from "react";

const SecondaryButton = ({ label, onClick, type = "button", className = "" }) => {
  return (
    <button type={type} className={`br-button block secondary mb-3 ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default SecondaryButton;

