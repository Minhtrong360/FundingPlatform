function Spinner() {
  return (
    <div
      className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-white-600 rounded-full dark:text-blue-500"
      role="status"
      aria-label="loading"
    ></div>
  );
}

export default Spinner;
