import React from "react";
import renderer from "react-test-renderer";

import Wip from "../Wip";

describe("Wip", () => {
  test("renders as expected given minimal props", () => {
    const tree = renderer.create(<Wip pageName="pageName" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test("renders as expected given full props", () => {
    const tree = renderer
      .create(<Wip className="className" pageName="pageName" />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
