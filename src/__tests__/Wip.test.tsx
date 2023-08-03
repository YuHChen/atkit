import React from "react";
import { render } from "@testing-library/react";

import Wip from "../Wip";

describe("Wip", () => {
  test("renders as expected given minimal props", () => {
    const { container } = render(<Wip pageName="pageName" />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test("renders as expected given full props", () => {
    const { container } = render(
      <Wip className="className" pageName="pageName" />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
