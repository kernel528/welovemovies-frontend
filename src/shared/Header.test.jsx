import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { version } from "../../package.json";
import Header from "./Header";

test("renders the package version in the hero banner", () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

  expect(screen.getByText(`v${version}`)).not.toBeNull();
});
