import React from "react";
import { render } from "@testing-library/react";

import Atkit from "../Atkit";

describe("Atkit", () => {
  test("renders as expected in production", () => {
    const { container } = render(<Atkit isDevo={false} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test("renders as expected in development", () => {
    const { container } = render(<Atkit isDevo={true} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
