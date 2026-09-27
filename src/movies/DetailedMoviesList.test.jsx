import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DetailedMoviesList from "./DetailedMoviesList";
import { listMovies } from "../utils/api";

vi.mock("../utils/api", () => ({
  listMovies: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

test("shows a loading state while all movies are requested", () => {
  listMovies.mockReturnValue(new Promise(() => {}));

  render(<DetailedMoviesList />);

  expect(screen.getByRole("status").textContent).toBe("Loading movies...");
});

test("shows an API error after the all-movies request fails", async () => {
  listMovies.mockRejectedValue(new Error("Movies are unavailable."));

  render(<DetailedMoviesList />);

  expect(await screen.findByText("Error: Movies are unavailable.")).not.toBeNull();
});
