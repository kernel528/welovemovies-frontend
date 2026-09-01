import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import MoviesList from "./MoviesList";
import { listMovies } from "../utils/api";

vi.mock("../utils/api", () => ({
  listMovies: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

test("shows a loading state while movies are requested", () => {
  listMovies.mockReturnValue(new Promise(() => {}));

  render(
    <MemoryRouter>
      <MoviesList />
    </MemoryRouter>
  );

  expect(screen.getByRole("status").textContent).toBe("Loading movies...");
});

test("shows an API error after the movie request fails", async () => {
  listMovies.mockRejectedValue(new Error("Movies are unavailable."));

  render(
    <MemoryRouter>
      <MoviesList />
    </MemoryRouter>
  );

  expect(await screen.findByText("Error: Movies are unavailable.")).not.toBeNull();
});
