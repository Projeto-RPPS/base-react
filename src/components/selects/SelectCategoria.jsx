import React, { useState, useEffect } from 'react';
import categoriaService from '../../service/categoriaService';

const SelectCategoria = ({ value, onChange }) => {
  const [categorias, setCategorias] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    categoriaService.listarCategorias()
      .then(response => setCategorias(response.data))
      .catch(error => console.error("Erro ao buscar categorias", error));
  }, []);
  
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    
    if (onChange) {
      onChange({
        target: {
          id: "idCategoria",
          value: selectedValue
        }
      });
    }
    setIsOpen(false);
  };
  
  const toggleList = (e) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  const selectedCategoria = categorias.find(item => 
    item.idCategoria === (typeof value === 'string' ? parseInt(value) : value)
  );

  return (
    <div className="br-select">
      <div className="br-input">
        <label htmlFor="select-categoria">Categoria</label>
        <input
          id="select-categoria"
          type="text"
          placeholder="Selecione a categoria"
          value={selectedCategoria ? selectedCategoria.nomeCategoria : ''}
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
        <div className="br-list" tabIndex="0" expanded="true">
          {categorias.map(categoria => (
            <div 
              className="br-item" 
              key={categoria.idCategoria} 
              tabIndex="-1"
              onClick={() => handleSelectChange({
                target: {
                  value: categoria.idCategoria
                }
              })}
            >
              <div className="br-radio">
                <input
                  id={`rb-${categoria.idCategoria}`}
                  type="radio"
                  name="categoria-select"
                  value={categoria.idCategoria}
                  onChange={handleSelectChange}
                  checked={value == categoria.idCategoria} // Usando == para comparar string/number
                  readOnly
                />
                <label htmlFor={`rb-${categoria.idCategoria}`}>
                  {categoria.nomeCategoria}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectCategoria;