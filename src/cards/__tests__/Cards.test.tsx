import React from "react";
import renderer from "react-test-renderer";

import Cards from "../Cards";

describe("Cards", () => {
  test("renders as expected", () => {
    const tree = renderer.create(<Cards />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
