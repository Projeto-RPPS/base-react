import React, { useState, useEffect } from 'react';
import tipoParentescoService from '../../service/tipoParentescoService';

const SelectTipoParentesco = ({ onChange, value, name }) => {
  const [tiposDeParentesco, setTiposDeParentesco] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false); // Fecha o menu após a seleção
  };
  
  const toggleList = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="br-select">
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
      {isOpen && ( // Renderização condicional mais explícita
        <div className="br-list" tabIndex="0" expanded="true">
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