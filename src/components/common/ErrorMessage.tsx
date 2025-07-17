export default function ErrorMessage({
  message,
  onClickCallback,
}: {
  message: string;
  onClickCallback?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-8 stroke-red-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
        <h2 className="text-center text-xl text-red-600">Error</h2>
      </div>
      <p className="text-gray-700">{message}</p>
      <button
        onClick={() => onClickCallback?.()}
        className="rounded-full bg-sky-400 px-6 py-2 text-white hover:bg-sky-500 focus:bg-sky-600"
      >
        Try again
      </button>
    </div>
  );
}
