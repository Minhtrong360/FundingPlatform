function SpinnerBtn() {
  return (
    <div
      className="animate-spin inline-block w-4 h-4 border-[1px] border-white border-t-transparent text-white-600 rounded-full dark:text-blue-500"
      role="status"
      aria-label="loading"
    ></div>
  );
}

export default SpinnerBtn;
