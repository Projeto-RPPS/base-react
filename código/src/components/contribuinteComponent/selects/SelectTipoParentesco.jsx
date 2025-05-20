import React, { useState, useEffect, useRef } from 'react';
import tipoParentescoService from '../../../service/contribuinte/tipoParentescoService';

const SelectTipoParentesco = ({ onChange, value, name }) => {
  const [tiposDeParentesco, setTiposDeParentesco] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    tipoParentescoService.listarTipoDeParentesco()
      .then(response => setTiposDeParentesco(response.data))
      .catch(error => console.error("Erro ao buscar tipos de parentesco", error));
  }, []);
  
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    
    if (onChange) {
      onChange({
        target: {
          id: "idTipoParentesco",
          value: selectedValue
        }
      });
    }
    setIsOpen(false);
  };
  
  const toggleList = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="br-select" ref={selectRef} style={{ position: "relative" }}>
      <div className="br-input">
        <label htmlFor={`select-tipo-parentesco-${name}`}>Tipo de Parentesco</label>
        <input
          id={`select-tipo-parentesco-${name}`}
          type="text"
          placeholder="Selecione o item"
          value={
            value
              ? tiposDeParentesco.find(item => item.idTipoParentesco === parseInt(value))?.descricaoParentesco
              : ''
          }
          readOnly
          onClick={toggleList}
        />
        <button className="br-button" type="button" aria-label="Exibir lista" onClick={toggleList}>
          <i className="fas fa-angle-down" aria-hidden="true"></i>
        </button>
      </div>
      {isOpen && (
        <div
          className="br-list"
          tabIndex="0"
          style={{
            display: "block",
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            maxHeight: "13rem",
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 10,
          }}
        >
          {tiposDeParentesco.map(tipo => (
            <div className="br-item" key={tipo.idTipoParentesco} tabIndex="-1">
              <div className="br-radio">
                <input
                  id={`rb${tipo.idTipoParentesco}-${name}`}
                  type="radio"
                  name={`tipo-de-parentesco-${name}`}
                  value={tipo.idTipoParentesco}
                  onChange={handleSelectChange}
                  checked={value === tipo.idTipoParentesco.toString()}
                />
                <label htmlFor={`rb${tipo.idTipoParentesco}-${name}`}>{tipo.descricaoParentesco}</label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectTipoParentesco;