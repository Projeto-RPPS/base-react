import React, { useEffect, useRef, useState } from "react";
import beneficioService from "../../../service/beneficio/beneficioService";

const SelectBeneficio = ({ value, onChange, required = false }) => {
  const [beneficios, setBeneficios] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedBeneficio = beneficios.find(b => b.idBeneficio == value);

  useEffect(() => {
    const carregarBeneficios = async () => {
      try {
        const data = await beneficioService.listarBeneficios();
        const ativos = data.filter((b) => b.ativo);
        setBeneficios(ativos);
      } catch (error) {
        console.error("Erro ao carregar benefícios:", error);
      }
    };
    carregarBeneficios();
  }, []);

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

  const handleSelectChange = (id) => {
    const fakeEvent = {
      target: {
        id: "beneficioId",
        value: id
      }
    };
    onChange(fakeEvent);
    setIsOpen(false);
  };

  return (
    <div className="col-md-7 mb-3 br-select" ref={selectRef} style={{ position: "relative" }}>
      <div className="br-input">
        <label htmlFor="select-beneficio">Selecione o Benefício</label>
        <input
          id="select-beneficio"
          type="text"
          placeholder="Selecione o benefício"
          value={selectedBeneficio ? selectedBeneficio.tipo : ""}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
        />
        <button
          className="br-button"
          type="button"
          aria-label="Exibir lista"
          onClick={() => setIsOpen(!isOpen)}
        >
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
          {beneficios.map((beneficio) => (
            <div
              className="br-item"
              key={beneficio.idBeneficio}
              onClick={() => handleSelectChange(beneficio.idBeneficio)}
            >
              <div className="br-radio">
                <input
                  id={`rb-${beneficio.idBeneficio}`}
                  type="radio"
                  name="beneficio-select"
                  value={beneficio.idBeneficio}
                  checked={value == beneficio.idBeneficio}
                  readOnly
                />
                <label htmlFor={`rb-${beneficio.idBeneficio}`}>
                  {beneficio.tipo}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectBeneficio;


