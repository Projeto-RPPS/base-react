// src/components/global/messageComponent/AlertaErro.jsx
import React from 'react';

const AlertaErro = ({ 
  title = "Erro", 
  message, 
  onClose, 
  show = true 
}) => {
  if (!show) return null;

  return (
    <div className="br-message danger" role="alert">
      <div className="icon">
        <i className="fas fa-times-circle fa-lg" aria-hidden="true"></i>
      </div>
      <div className="content" aria-label={`${title} ${message}`}>
        <span className="message-title">{title}</span>
        {message && <span className="message-body"> {message}</span>}
      </div>
      {onClose && (
        <div className="close">
          <button 
            className="br-button circle small" 
            type="button" 
            aria-label="Fechar mensagem de erro"
            onClick={onClose}
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertaErro;