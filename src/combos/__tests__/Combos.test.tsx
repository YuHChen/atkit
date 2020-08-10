import React from "react";
import { render } from "@testing-library/react";

import Combos from "../Combos";

describe("Combos", () => {
  test("renders as expected", () => {
    const { container } = render(<Combos />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
