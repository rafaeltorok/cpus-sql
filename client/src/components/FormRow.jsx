// Dependencies
import React from "react";
import PropTypes from 'prop-types';


// Component
export default function FormRow({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="form-row">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

FormRow.displayName = "FormRow";

FormRow.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
  onChange: PropTypes.func.isRequired,
}