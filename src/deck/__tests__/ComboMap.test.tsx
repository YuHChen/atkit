import React from "react";
import renderer from "react-test-renderer";

import ComboMap from "../ComboMap";

describe("ComboMap", () => {
  test("renders as expected", () => {
    const tree = renderer.create(<ComboMap />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
