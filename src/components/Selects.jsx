import React, { useState } from 'react';
import GovButton from './Button';
export default function GovSelect({ label, placeholder, options = [], selected, onSelect, inverted }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="br-select">
      <div className="br-input">
        {label && <label htmlFor="gov-select">{label}</label>}
        <input id="gov-select" type="text" readOnly placeholder={placeholder} value={selected?.label || ''} onClick={() => setOpen(!open)} />
        <GovButton circle inverted={inverted} onClick={() => setOpen(!open)} aria-label="Exibir lista" tabIndex={-1}>
          <i className="fas fa-angle-down" aria-hidden="true" />
        </GovButton>
      </div>
      {open && (
        <div className="br-list" tabIndex={0}>
          {options.map(opt => (
            <div key={opt.value} className="br-item" tabIndex={-1} onClick={() => { onSelect(opt); setOpen(false); }}>
              <div className="br-radio">
                <input type="radio" id={`opt-${opt.value}`} name="gov-select" checked={selected?.value === opt.value} readOnly />
                <label htmlFor={`opt-${opt.value}`}>{opt.label}</label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}