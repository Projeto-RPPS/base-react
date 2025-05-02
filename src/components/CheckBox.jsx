import React from 'react';
import classNames from 'classnames';
export default function GovCheckbox({ id, name, label, checked, indeterminate = false, onChange, invalid, valid, small, inverted, ...props }) {
  const classes = classNames('br-checkbox', { 'is-invalid': invalid, valid, small, 'dark-mode': inverted });
  return (
    <div className={classes}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        aria-checked={indeterminate ? 'mixed' : checked}
        {...(indeterminate ? { indeterminate: true } : {})}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}