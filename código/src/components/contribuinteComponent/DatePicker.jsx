import React, { useEffect, useRef } from "react";


const DatePicker = ({ 
  id, 
  label, 
  value, 
  onChange, 
  minDate = "15/04/2022", 
  maxDate = "current"
}) => {
  const datepickerContainerRef = useRef(null);
  const datepickerInstanceRef = useRef(null);

  // Função para obter a data atual no formato dd/mm/yyyy
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Converte dd/mm/yyyy para yyyy-mm-dd
  const formatToISO = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  // Converte yyyy-mm-dd para dd/mm/yyyy
  const formatToDisplay = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    // Verifica se o core está carregado
    if (!window.core) {
      console.error("Core do GovBR não está carregado!");
      return;
    }

    const initializeDatepicker = () => {
      if (datepickerContainerRef.current) {
        // Destrói qualquer instância existente
        if (datepickerInstanceRef.current && typeof datepickerInstanceRef.current.destroy === 'function') {
          datepickerInstanceRef.current.destroy();
        }

        // Resolve o maxDate (usa data atual se for "current")
        const resolvedMaxDate = maxDate === "current" ? getCurrentDate() : maxDate;

        // Cria nova instância do datepicker
        // eslint-disable-next-line no-undef
        datepickerInstanceRef.current = new core.BRDateTimePicker(
          'br-datetimepicker', 
          datepickerContainerRef.current,
          {
            minDate: minDate,
            maxDate: resolvedMaxDate,
            dateFormat: 'd/m/Y',
            position: 'below' // Força o calendário a aparecer abaixo
          }
        );

        // Configura o evento de change
        const input = datepickerContainerRef.current.querySelector('[data-input]');
        if (input) {
          input.addEventListener('change', (e) => {
            if (onChange && e.target.value) {
              // Converte para formato ISO (yyyy-mm-dd)
              onChange(formatToISO(e.target.value));
            }
          });

          // Define o valor inicial formatado
          if (value) {
            input.value = formatToDisplay(value);
          }
        }

        // Ajuste adicional de posicionamento
        const calendar = datepickerContainerRef.current.querySelector('.flatpickr-calendar');
        if (calendar) {
          calendar.style.top = 'calc(100% + 5px)';
          calendar.style.left = '0';
          calendar.style.width = 'auto';
        }
      }
    };

    // Inicializa o datepicker
    initializeDatepicker();

    return () => {
      // Limpeza ao desmontar
      if (datepickerInstanceRef.current && typeof datepickerInstanceRef.current.destroy === 'function') {
        datepickerInstanceRef.current.destroy();
      }
    };
  }, [minDate, maxDate, onChange, value]);

  return (
    <div className="col-md-4">
      <div 
        ref={datepickerContainerRef}
        className="br-datetimepicker" 
        data-mode="single" 
        data-type="text"
      >
        <div className="br-input has-icon">
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            type="text"
            placeholder="ex: 02/02/2024"
            data-input="data-input"
            aria-label={label}
          />
          <button
            className="br-button circle small"
            type="button"
            aria-label="Abrir Datepicker"
            data-toggle="data-toggle"
            id={`${id}-btn`}
            tabIndex="-1"
          >
            <i className="fas fa-calendar-alt" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;