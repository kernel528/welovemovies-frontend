import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import TheaterList from "./TheaterList";
import { listTheaters } from "../utils/api";

vi.mock("../utils/api", () => ({
  listTheaters: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

test("shows a loading state while theaters are requested", () => {
  listTheaters.mockReturnValue(new Promise(() => {}));

  render(<TheaterList />);

  expect(screen.getByRole("status").textContent).toBe("Loading theaters...");
});

test("shows an API error after the theater request fails", async () => {
  listTheaters.mockRejectedValue(new Error("Theaters are unavailable."));

  render(<TheaterList />);

  expect(await screen.findByText("Error: Theaters are unavailable.")).not.toBeNull();
});
