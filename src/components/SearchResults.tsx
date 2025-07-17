import { useEffect, useState } from "react";
import LoadingSpinner from "./common/LoadingSpinner";
import ErrorMessage from "./common/ErrorMessage";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import type { JobPosting } from "../scrapers/types";

function JobListing({
  title,
  company,
  location,
  link,
}: {
  title: string;
  company: string;
  location: string;
  link: string;
}) {
  return (
    <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-0 right-0 bottom-0 left-0"
      />
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600">{company}</p>
        <p className="text-gray-500">{location}</p>
      </div>
    </div>
  );
}

export default function SearchResults() {
  const [results, setResults] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fetchResults = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/jobposting?" + params);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = (await response.json()) as { data: JobPosting[] };
        setResults(data.data);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("Failed to fetch job listings:", error);
        }
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const query = params.get("q");
    if (!query || query.trim() === "") {
      if (import.meta.env.DEV) {
        console.warn("No search query provided in URL parameters.");
      }
      navigate("/");
      return;
    }

    if (!isError) {
      fetchResults();
    }
  }, [isError]);
  return (
    <div className="grow rounded-xl border-1 border-gray-200 bg-gray-50 lg:overflow-y-auto">
      <div className="flex min-h-full w-full flex-col gap-4 p-4">
        {(isLoading && (
          <div className="flex h-full grow items-center justify-center">
            <LoadingSpinner />
          </div>
        )) ||
          (isError && (
            <div className="flex h-full grow items-center justify-center">
              <ErrorMessage
                message="Failed to get job listings."
                onClickCallback={() => {
                  setIsLoading(true);
                  setIsError(false);
                }}
              />
            </div>
          )) ||
          (results.length === 0 && !isLoading && !isError && (
            <p className="text-gray-500">No job listings found.</p>
          )) ||
          (results.length > 0 &&
            !isLoading &&
            results.map((result, index) => (
              <JobListing
                key={index}
                title={result.title}
                company={result.company}
                location={result.location}
                link={result.link}
              />
            )))}
      </div>
    </div>
  );
}
