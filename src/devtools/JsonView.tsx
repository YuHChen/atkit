import React from "react";

import CodeBlock from "./CodeBlock";
import { prettyPrint } from "./jsonUtils";
import type { Json } from "./types";

interface JsonViewProps {
  json: Json;
}

const JsonView: React.FC<JsonViewProps> = ({ json }: JsonViewProps) => (
  <CodeBlock language="json" code={prettyPrint(json)} />
);

export default JsonView;
