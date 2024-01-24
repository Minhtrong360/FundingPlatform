export default function Spinner() {
  return (
    <div
      className="flex items-center justify-center h-screen fixed top-auto left-1/2"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền overlay
          position: "fixed", // Để nền overlay cố định
          zIndex: 9998, // Chỉ số z để đảm bảo nó hiển thị trên cùng
        },
      }}
    >
      <div className="animate-spin h-12 w-12 text-blue-300">
        <LoaderIcon className="h-full w-full" />
      </div>
      <p className="ml-4 text-lg font-inter text-blue-300 dark:text-blue-400">
        Loading...
      </p>
    </div>
  );
}

function LoaderIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="6" />
      <line x1="12" x2="12" y1="18" y2="22" />
      <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
      <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
      <line x1="2" x2="6" y1="12" y2="12" />
      <line x1="18" x2="22" y1="12" y2="12" />
      <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
      <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
    </svg>
  );
}
