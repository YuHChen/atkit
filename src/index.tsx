import React from "react";
import ReactDOM from "react-dom";

import Atkit from "./Atkit";

import "./index.scss";

// see https://create-react-app.dev/docs/adding-custom-environment-variables/
const IS_DEVO = "development" === process.env.NODE_ENV;

ReactDOM.render(
  <React.StrictMode>
    <Atkit isDevo={IS_DEVO} />
  </React.StrictMode>,
  document.getElementById("root"),
);
