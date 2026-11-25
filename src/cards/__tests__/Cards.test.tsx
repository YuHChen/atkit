import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";

import Cards from "../Cards";

describe("Cards", () => {
  test("renders as expected", () => {
    render(<Cards />);

    const objCard = within(screen.getByRole("article", { name: "obj 1" }));
    expect(objCard.getByText("obj 1")).toBeInTheDocument();
    expect(objCard.getByText("type: object")).toBeInTheDocument();
    expect(objCard.getByText("id: 1")).toBeInTheDocument();

    const charCard = within(screen.getByRole("article", { name: "char 1" }));
    expect(charCard.getByText("char 1")).toBeInTheDocument();
    expect(charCard.getByText("type: character")).toBeInTheDocument();
    expect(charCard.getByText("id: 2")).toBeInTheDocument();
  });
});
