import React from "react";
import { render } from "@testing-library/react";

import ComboMap from "../ComboMap";

describe("ComboMap", () => {
  test("renders as expected", () => {
    const { container } = render(<ComboMap />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
