import React, { useState, useRef, useEffect } from "react";

export default function SelectEstado({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  
  const estados = [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", 
    "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", 
    "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", 
    "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", 
    "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", 
    "Santa Catarina", "São Paulo", "Sergipe", "Tocantins", "Exterior"
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

  const handleSelectChange = (estado) => {
    setIsOpen(false);
    
    if (onChange) {
      onChange({
        target: {
          id: "estado",
          value: estado
        }
      });
    }
  };

  const toggleList = (e) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  return (
    <div className="br-select" ref={selectRef}>
      <div className="br-input">
        <label htmlFor="select-estado">Estado</label>
        <input
          id="select-estado"
          type="text"
          placeholder="Selecione o estado"
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
        <div className="br-list" tabIndex="0" style={{ display: 'block' }}>
          {estados.map((estado, index) => (
            <div 
              className="br-item" 
              key={index} 
              tabIndex="-1"
              onClick={() => handleSelectChange(estado)}
            >
              <div className="br-radio">
                <input
                  id={`rb-${index}`}
                  type="radio"
                  name="estados-brasil"
                  value={estado}
                  checked={value === estado}
                  readOnly
                />
                <label htmlFor={`rb-${index}`}>{estado}</label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}