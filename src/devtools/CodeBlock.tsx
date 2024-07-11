/*
  workaround for highlight.js types
  see https://github.com/highlightjs/highlight.js/issues/2682
  track potential fix https://github.com/DefinitelyTyped/DefinitelyTyped/pull/52120
*/
/// <reference types="../../node_modules/highlight.js" />
import hljs from "highlight.js/lib/core";
import React from "react";

import "highlight.js/styles/vs2015.css";

import "./codeBlock.scss";

// limiting to subset of languages at
// https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
type Language = "json" | "javascript" | "typescript" | "xml";

const registeredLanguages: { [key: string]: boolean } = {};

const registerLanguage = (languageName: Language) => {
  if (!registeredLanguages[languageName]) {
    // see https://github.com/highlightjs/highlight.js/issues/3223#issuecomment-886143417
    // on why we need the relative import
    // track https://github.com/webpack/webpack/issues/13865 for the fix
    const language = require(
      `../../node_modules/highlight.js/lib/languages/${languageName}`,
    );
    hljs.registerLanguage(languageName, language);
    registeredLanguages[languageName] = true;
  }
};

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
    registerLanguage(language);
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
