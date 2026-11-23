import React from "react";

import type { Json } from "../data/types";
import CodeBlock from "./CodeBlock";
import { prettyPrint } from "./jsonUtils";

interface JsonViewProps {
  json: Json;
}

const JsonView: React.FC<JsonViewProps> = ({ json }: JsonViewProps) => (
  <CodeBlock language="json" code={prettyPrint(json)} />
);

export default JsonView;
