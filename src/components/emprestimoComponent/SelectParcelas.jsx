// src/components/emprestimoComponent/SelectParcelas.jsx
import React, { useState, useRef, useEffect } from "react";

export default function SelectParcelas({
  value: propValue,
  onChange,
  disabled,
  firstValue,
  standardValue,
  startAt,            // parcela inicial (ex: 5)
  totalInstallments,  // parcela final (ex: 10)
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [userHasSelected, setUserHasSelected] = useState(false);
  const selectRef = useRef(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Captura largura do wrapper
  useEffect(() => {
    if (selectRef.current) {
      const { width } = selectRef.current.getBoundingClientRect();
      setDropdownWidth(width);
    }
  }, []);

  const toggleList = (e) => {
    e.stopPropagation();
    if (!disabled) setIsOpen((o) => !o);
  };

  const handleSelectChange = (parcelaNum) => {
    setUserHasSelected(true);
    onChange(parcelaNum);
    setIsOpen(false);
  };

  // Quantas opções teremos
  const count = totalInstallments - startAt + 1;

  // Gera array [ startAt, startAt+1, …, totalInstallments ]
  const options = Array.from({ length: count }, (_, idx) => {
    const parcelaNum = startAt + idx;
    const qtd = idx + 1; // qtd de parcelas contando a partir da primeira
    // se qtd = 1 usa firstValue, senão acumula standardValue
    const valorTotal =
      qtd === 1
        ? firstValue
        : firstValue + (qtd - 1) * standardValue;

    return {
      key: parcelaNum,
      value: parcelaNum,
      label: `${parcelaNum}x — ${valorTotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`,
    };
  });

  // label e placeholder
  const selectedLabel = userHasSelected
    ? options.find((o) => o.value === propValue)?.label || ""
    : "";
  const placeholderText = userHasSelected
    ? ""
    : "Selecione o número de parcelas";

  return (
    <div
      className="br-select"
      ref={selectRef}
      style={{ width: "260px" /* ajuste conforme layout */ }}
    >
      <div className="br-input" style={{ width: "100%" }}>
        <label htmlFor="select-parcelas">N° parcelas</label>
        <input
          id="select-parcelas"
          type="text"
          placeholder={placeholderText}
          value={selectedLabel}
          readOnly
          onClick={toggleList}
          style={{ width: "100%" }}
        />
        <button
          className="br-button"
          type="button"
          aria-label="Exibir lista"
          onClick={toggleList}
          disabled={disabled}
        >
          <i className="fas fa-angle-down" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div
          className="br-list"
          tabIndex="0"
          style={{
            display: "block",
            maxHeight: "160px",
            overflowY: "auto",
            width: dropdownWidth,
            boxSizing: "border-box",
          }}
        >
          {options.map(({ key, label, value }) => (
            <div
              className="br-item"
              key={key}
              tabIndex="-1"
              onClick={() => handleSelectChange(value)}
            >
              <div className="br-radio">
                <input
                  id={`rp${key}`}
                  type="radio"
                  name="parcelas-antecipar"
                  value={value}
                  checked={propValue === value}
                  readOnly
                />
                <label htmlFor={`rp${key}`}>{label}</label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}