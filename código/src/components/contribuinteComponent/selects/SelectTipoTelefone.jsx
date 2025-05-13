import React, { useState, useRef, useEffect } from "react";

export default function SelectTipoTelefone({ onChange, value, name }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  
  const tiposTelefone = [
    "Celular",
    "Residencial",
    "Comercial"
  ];

  // Fecha o dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectChange = (tipo) => {
    setIsOpen(false);
    
    if (onChange) {
      onChange({
        target: {
          id: "tipoTelefone",
          value: tipo
        }
      });
    }
  };

  const toggleList = (e) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  return (
    <div className="br-select" ref={selectRef} style={{ position: "relative" }}>
      <div className="br-input">
        <label htmlFor={`select-tipo-telefone-${name}`}>Tipo de Telefone</label>
        <input
          id={`select-tipo-telefone-${name}`}
          type="text"
          placeholder="Selecione o tipo"
          value={value || ""}
          readOnly
          onClick={toggleList}
        />
        <button 
          className="br-button" 
          type="button" 
          aria-label="Exibir lista" 
          onClick={toggleList}
        >
          <i className="fas fa-angle-down" aria-hidden="true"></i>
        </button>
      </div>
      {isOpen && (
        <div 
          className="br-list" 
          tabIndex="0"
          style={{
            display: 'block',
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: '13rem',
            overflowY: 'auto',
            background: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10
          }}
        >
          {tiposTelefone.map((tipo, index) => (
            <div 
              className="br-item" 
              key={index} 
              tabIndex="-1"
              onClick={() => handleSelectChange(tipo)}
            >
              <div className="br-radio">
                <input
                  id={`tipo-tel-${index}-${name}`}
                  type="radio"
                  name={`tipo-telefone-${name}`}
                  value={tipo}
                  checked={value === tipo}
                  readOnly
                />
                <label htmlFor={`tipo-tel-${index}-${name}`}>{tipo}</label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}