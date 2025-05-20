import React, { useState, useEffect, useRef } from 'react';
import categoriaService from '../../../service/contribuinte/categoriaService';

const SelectCategoria = ({ value, onChange }) => {
  const [categorias, setCategorias] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectRef = useRef(null);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await categoriaService.listarCategorias();
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSelectChange = (selectedValue) => {
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
  
  const toggleList = async (e) => {
    e.stopPropagation();
    const willOpen = !isOpen;
    
    if (willOpen) {
      await fetchCategorias();
    }
    
    setIsOpen(willOpen);
  };

  const selectedCategoria = categorias.find(item => 
    item.idCategoria === (typeof value === 'string' ? parseInt(value) : value)
  );

  return (
    <div className="br-select" ref={selectRef} style={{ position: "relative" }}>
      <div className="br-input">
        <label htmlFor="select-categoria">Categoria</label>
        <input
          id="select-categoria"
          type="text"
          placeholder="Selecione a categoria"
          value={selectedCategoria ? selectedCategoria.nomeCategoria : ''}
          readOnly
          onClick={toggleList}
          disabled={loading}
        />
        <button 
          className="br-button" 
          type="button" 
          aria-label="Exibir lista" 
          onClick={toggleList}
          disabled={loading}
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
          ) : (
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          )}
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
          {categorias.map(categoria => (
            <div 
              className="br-item" 
              key={categoria.idCategoria} 
              tabIndex="-1"
              onClick={() => handleSelectChange(categoria.idCategoria)}
            >
              <div className="br-radio">
                <input
                  id={`rb-${categoria.idCategoria}`}
                  type="radio"
                  name="categoria-select"
                  value={categoria.idCategoria}
                  onChange={() => handleSelectChange(categoria.idCategoria)}
                  checked={value == categoria.idCategoria}
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