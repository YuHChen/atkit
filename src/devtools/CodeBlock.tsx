import React from "react";

import hljs from "../assets/js/@highlightjs/cdn-assets/es/core.js";
import json from "../assets/js/@highlightjs/cdn-assets/es/languages/json.min.js";
import xml from "../assets/js/@highlightjs/cdn-assets/es/languages/xml.min.js";
import "../assets/js/@highlightjs/cdn-assets/styles/vs2015.css";
import "./codeBlock.scss";

// limiting to subset of languages at
// https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
const LANGUAGES = {
  json,
  xml,
} as const;
type Language = keyof typeof LANGUAGES;
for (const [languageName, language] of Object.entries(LANGUAGES)) {
  hljs.registerLanguage(languageName, language);
}

const classNames = (...names: (string | undefined)[]) =>
  names.filter((name) => undefined !== name).join(" ");

interface CodeBlockProps {
  language?: Language;
  code: string;
  className?: string;
  bgColor?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = (props: CodeBlockProps) => {
  const { language, code } = props;

  let highlightedCode;
  if (language) {
    highlightedCode = hljs.highlight(code, { language }).value;
  } else {
    highlightedCode = hljs.highlightAuto(code).value;
  }

  return (
    <div className={classNames(props.className, "atkit-code-block")}>
      <pre>
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
};

export default CodeBlock;
