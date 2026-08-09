import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HeaderNav from "./HeaderNav";

test("renders navigation links for the primary routes", () => {
  render(
    <MemoryRouter>
      <HeaderNav />
    </MemoryRouter>
  );

  expect(screen.getByRole("link", { name: "WeLoveMovies" }).getAttribute("href")).toBe("/");
  expect(screen.getByRole("link", { name: "All Movies" }).getAttribute("href")).toBe("/movies");
  expect(screen.getByRole("link", { name: "All Theaters" }).getAttribute("href")).toBe("/theaters");
});
