import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import Cards, { CardsProps } from "../Cards";

describe("Cards", () => {
  const cards = [
    {
      name: "obj 1",
      type: "object",
      id: "1",
    },
    {
      name: "char 1",
      type: "character",
      id: "2",
    },
  ] satisfies CardsProps["cards"];

  test("renders as expected given cards", () => {
    render(<Cards cards={cards} />);

    const objCard = within(screen.getByRole("article", { name: "obj 1" }));
    expect(objCard.getByText("obj 1")).toBeInTheDocument();
    expect(objCard.getByText("type: object")).toBeInTheDocument();
    expect(objCard.getByText("id: 1")).toBeInTheDocument();

    const charCard = within(screen.getByRole("article", { name: "char 1" }));
    expect(charCard.getByText("char 1")).toBeInTheDocument();
    expect(charCard.getByText("type: character")).toBeInTheDocument();
    expect(charCard.getByText("id: 2")).toBeInTheDocument();
  });

  test("renders as expected given no cards", () => {
    render(<Cards />);

    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(2);
    expect(alerts[1]).toBeInTheDocument();
    expect(alerts[1]).toHaveTextContent(/loading/i);

    expect(screen.queryByText("type:")).not.toBeInTheDocument();
  });
});
