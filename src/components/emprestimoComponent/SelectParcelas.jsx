import { useState, useRef, useEffect } from "react";

export default function SelectParcelas({ value, onChange, availableCount, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleList = (e) => {
    e.stopPropagation();
    if (!disabled && availableCount > 0) setIsOpen((prev) => !prev);
  };

  const handleSelectChange = (count) => {
    setIsOpen(false);
    onChange(count);
  };

  return (
    <div
      className="br-select"
      ref={selectRef}
      style={{ position: "relative", width: "4rem" }} // largura fixa para números
    >
      <div className="br-input">
        <label htmlFor="select-parcelas">N° parcelas</label>
        <input
          id="select-parcelas"
          type="text"
          placeholder="Selecione"
          value={availableCount > 0 ? value : ""}
          readOnly
          onClick={toggleList}
          style={{ width: "95%", textAlign: "center" }} // centraliza o número
        />
        <button
          className="br-button"
          type="button"
          aria-label="Exibir lista"
          onClick={toggleList}
          disabled={disabled || availableCount === 0}
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
            position: "absolute",
            top: "100%",
            left: 0,
            width: "90%",
            maxHeight: "10rem",
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 10,
          }}
        >
          {Array.from({ length: availableCount }, (_, i) => {
            const val = i + 1;
            return (
              <div
                className="br-item"
                key={val}
                tabIndex="-1"
                onClick={() => handleSelectChange(val)}
                style={{ textAlign: "center" }} // centraliza item
              >
                <div className="br-radio">
                  <input
                    id={`rp${val}`}
                    type="radio"
                    name="parcelas-antecipar"
                    value={val}
                    checked={value === val}
                    readOnly
                  />
                  <label htmlFor={`rp${val}`}>{val}</label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}