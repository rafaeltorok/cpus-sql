// TypeScript types
interface FormRowProps {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  float: boolean;
  onChange: (e: Event) => void;
}

type Event = React.ChangeEvent<HTMLInputElement>;

// Component
export default function FormRow({
  id,
  type,
  label,
  placeholder,
  value,
  float,
  onChange,
}: FormRowProps) {
  return (
    <div className="form-row">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        step={float ? "0.1" : ""}
        onChange={onChange}
      />
    </div>
  );
}
