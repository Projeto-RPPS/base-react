import React, { useEffect } from "react";

export default function Message({
  type = "info",        // "success" | "warning" | "danger" | "info"
  title,
  children,
  onClose,
  className = "",
  autoClose = 5000
}) {
  
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div className={`br-message ${type} ${className}`}>
      <div className="icon">
        {type === "success" && <i className="fas fa-check-circle fa-lg" aria-hidden="true"/>}
        {type === "warning" && <i className="fas fa-exclamation-triangle fa-lg" aria-hidden="true"/>}
        {type === "danger"  && <i className="fas fa-times-circle fa-lg" aria-hidden="true"/>}
        {type === "info"    && <i className="fas fa-info-circle fa-lg" aria-hidden="true"/>}
      </div>
      <div className="content" role="alert" aria-label={title}>
        {title && <span className="message-title">{title}</span>}
        <span className="message-body">{children}</span>
      </div>
      {onClose && (
        <div className="close">
          <button
            className="br-button circle small"
            type="button"
            aria-label="Fechar alerta"
            onClick={onClose}
          >
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}