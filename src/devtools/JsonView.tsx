import React from "react";

import CodeBlock from "./CodeBlock";
import type { Json } from "./types";

interface JsonViewProps {
  json: Json;
}

const JsonView: React.FC<JsonViewProps> = ({ json }: JsonViewProps) => (
  <CodeBlock
    language="json"
    code={"string" === typeof json ? json : JSON.stringify(json, null, 2)}
  />
);

export default JsonView;
