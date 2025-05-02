import React from 'react';
import classNames from 'classnames';
export default function GovTextarea({ id, label, placeholder, density = 'medium', value, onChange }) {
  const classes = classNames('br-textarea', density);
  return (
    <div className={classes}>
      {label && <label htmlFor={id}>{label}</label>}
      <textarea id={id} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}