import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Review from "./Review";

test("renders review content as text", () => {
  const { container } = render(
    <Review
      review={{
        review_id: 1,
        content: '<img src="x" onerror="alert(1)">',
        score: 3,
        critic: {
          preferred_name: "Ava",
          surname: "Stone",
          organization_name: "Cinema Weekly",
        },
      }}
      deleteReview={vi.fn()}
      setReviewScore={vi.fn()}
    />
  );

  expect(screen.getByText('<img src="x" onerror="alert(1)">')).not.toBeNull();
  expect(container.querySelector("img")).toBeNull();
});
