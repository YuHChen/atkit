import React from "react";
import { createRoot } from "react-dom/client";

import Atkit from "./Atkit";

import "./index.scss";

// see https://create-react-app.dev/docs/adding-custom-environment-variables/
const IS_DEVO = "development" === process.env.NODE_ENV;

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Atkit isDevo={IS_DEVO} />
  </React.StrictMode>,
);
