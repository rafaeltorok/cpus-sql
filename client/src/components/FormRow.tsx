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
