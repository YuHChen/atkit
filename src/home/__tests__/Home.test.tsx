import React from "react";
import { render } from "@testing-library/react";

import Home from "../Home";

describe("Home", () => {
  test("renders as expected", () => {
    const { container } = render(<Home />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
