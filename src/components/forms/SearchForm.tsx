import { navigate } from "astro:transitions/client";
import { useForm, type SubmitHandler } from "react-hook-form";

export default function SearchForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ jobname: string }>();
  const onSubmit: SubmitHandler<{ jobname: string }> = ({ jobname }) => {
    if (jobname) {
      navigate(`search?q=${encodeURIComponent(jobname)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="text-l mb-2 flex w-full items-center gap-4 rounded-lg border-1 border-gray-200 p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 stroke-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          className="grow appearance-none outline-0"
          placeholder="Enter job name here..."
          {...register("jobname", {
            required: "Please enter a job name.",
          })}
        />
      </div>
      <span className="mb-4 min-h-5 text-sm text-red-500">
        {!!errors.jobname?.message && errors.jobname.message}
      </span>
      <div className="flex w-full justify-center">
        <button
          type="submit"
          className="rounded-full bg-sky-400 px-8 py-4 text-white shadow-md hover:bg-sky-500 focus:bg-sky-600"
        >
          Find job listings
        </button>
      </div>
    </form>
  );
}
