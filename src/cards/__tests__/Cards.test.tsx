import React from "react";
import { render } from "@testing-library/react";

import Cards from "../Cards";

describe("Cards", () => {
  test("renders as expected", () => {
    const { container } = render(<Cards />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
