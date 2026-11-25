import React from "react";
import { prettyPrint } from "../data/jsonUtils";
import { Json } from "../data/types";
import CodeBlock from "./CodeBlock";

interface JsonViewProps {
  json: Json;
}

const JsonView: React.FC<JsonViewProps> = ({ json }: JsonViewProps) => (
  <CodeBlock language="json" code={prettyPrint(json)} />
);

export default JsonView;
