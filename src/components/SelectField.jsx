export default function SelectField({
  label,
  id,
  options,
  additional,
  ...rest
}) {
  return (
    <div style={additional}>
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm  darkTextWhite">
          {label}
        </label>
      )}
      <select
        id={id}
        className="hover:cursor-pointer py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "
        {...rest}
      >
        {options.map((option) => (
          <option key={option} value={option} className="hover:cursor-pointer">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
