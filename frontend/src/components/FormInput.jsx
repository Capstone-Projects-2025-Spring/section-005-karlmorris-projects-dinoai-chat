export default function FormInput({
    label,
    type = "text",
    id,
    name,
    value,
    onChange,
    required = false,
    placeholder = "",
    error = ""
  }) {
    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={id} className="block text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
