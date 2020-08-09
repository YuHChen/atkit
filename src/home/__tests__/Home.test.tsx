import React from "react";
import renderer from "react-test-renderer";

import Home from "../Home";

describe("Home", () => {
  test("renders as expected", () => {
    const tree = renderer.create(<Home />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
