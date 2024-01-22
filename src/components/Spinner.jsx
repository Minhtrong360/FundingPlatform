function Spinner() {
  return (
    <div
      className="fixed top-1/2 left-1/2 animate-spin inline-block w-16 h-16 border-[3px] border-blue-600 border-t-transparent text-white-600 rounded-full dark:text-blue-500"
      role="status"
      aria-label="loading"
    ></div>
  );
}

export default Spinner;
