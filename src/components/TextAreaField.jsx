export default function TextAreaField({ label, id, ...rest }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm text-gray-700 font-medium darkTextWhite"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows="4"
        className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
        {...rest}
      />
    </div>
  );
}
