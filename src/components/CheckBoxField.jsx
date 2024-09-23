export default function CheckboxField({ label, id, ...rest }) {
  return (
    <div className="mt-3 flex">
      <div className="flex">
        <input
          id={id}
          type="checkbox"
          className="hover:cursor-pointer shrink-0 mt-1.5 border-gray-300 rounded text-blue-600 pointer-events-none focus:ring-blue-500 "
          {...rest}
        />
      </div>
      <div className="ms-3">
        <label htmlFor={id} className="text-sm text-gray-600 darkTextGray400">
          {label}
        </label>
      </div>
    </div>
  );
}
