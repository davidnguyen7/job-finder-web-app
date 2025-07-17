/// <reference types="@vitest/browser/context" />

import { afterEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import pointer from "@testing-library/user-event";
import { navigate } from "astro:transitions/client";

import SearchForm from "../forms/SearchForm";

afterEach(() => {
  vi.clearAllMocks();
});

test("shows error on invalid input", async () => {
  render(<SearchForm />);
  await pointer.click(screen.getByText("Find job listings"));
  expect(screen.getByText("Please enter a job name.")).toBeInTheDocument();
});

test("navigates to search results on valid input", async () => {
  vi.mock(import("astro:transitions/client"), () => {
    return {
      navigate: vi.fn(),
    };
  });

  render(<SearchForm />);
  const input = screen.getByPlaceholderText("Enter job name here...");
  await pointer.type(input, "Software Engineer");
  await pointer.click(screen.getByText("Find job listings"));
  expect(navigate).toHaveBeenCalledTimes(1);
  expect(navigate).toHaveBeenCalledWith("search?q=Software%20Engineer");
});
