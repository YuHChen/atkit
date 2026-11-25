import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";

import Card from "../Card";

describe("Card", () => {
  test("renders as expected", () => {
    render(<Card id="1" name="test" type="character" />);
    const card = within(screen.getByRole("article", { name: "test" }));

    expect(card.getByText("test")).toBeInTheDocument();
    expect(card.getByText("type: character")).toBeInTheDocument();
    expect(card.getByText("id: 1")).toBeInTheDocument();
  });
});
