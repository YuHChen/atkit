import React from "react";
import renderer from "react-test-renderer";

import Atkit from "../Atkit";

describe("Atkit", () => {
  test("renders as expected", () => {
    const tree = renderer.create(<Atkit />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
