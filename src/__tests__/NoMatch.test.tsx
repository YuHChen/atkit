import React from "react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import NoMatch from "../NoMatch";

describe("NoMatch", () => {
  test("renders as expected given minimal props", () => {
    render(
      <MemoryRouter initialEntries={["/pathname"]}>
        <NoMatch />
      </MemoryRouter>,
    );
    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("pathname");
  });

  test("renders as expected given full props", () => {
    render(
      <MemoryRouter initialEntries={["/pathname"]}>
        <NoMatch className="className" />
      </MemoryRouter>,
    );
    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("pathname");
    expect(alert).toHaveClass("className");
  });
});
