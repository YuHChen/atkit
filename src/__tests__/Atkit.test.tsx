import React from "react";
import { render } from "@testing-library/react";

import Atkit from "../Atkit";

describe("Atkit", () => {
  test("renders as expected", () => {
    const { container } = render(<Atkit />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
