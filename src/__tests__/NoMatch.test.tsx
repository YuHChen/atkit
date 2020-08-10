import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import NoMatch from "../NoMatch";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn().mockReturnValue({
    pathname: "pathname",
  }),
}));

describe("NoMatch", () => {
  test("renders as expected given minimal props", () => {
    render(<NoMatch />);
    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("pathname");
  });

  test("renders as expected given full props", () => {
    render(<NoMatch className="className" />);
    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("pathname");
    expect(alert).toHaveClass("className");
  });
});
