export default function CheckboxField({ label, id, ...rest }) {
  return (
    <div className="mt-3 flex">
      <div className="flex">
        <input
          id={id}
          type="checkbox"
          className="shrink-0 mt-1.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark-bg-gray-800 dark-border-gray-700 dark-checked-bg-blue-500 dark-checked-border-blue-500 dark-focus-ring-offset-gray-800"
          {...rest}
        />
      </div>
      <div className="ms-3">
        <label
          htmlFor={id}
          className="text-sm text-gray-600 dark-text-gray-400"
        >
          {label}
        </label>
      </div>
    </div>
  );
}
