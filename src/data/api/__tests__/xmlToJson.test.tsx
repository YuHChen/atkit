import xmlToJson, { ConversionResult } from "../xmlToJson";

type QualifiedName = string | null;

interface TestHelper {
  expects: (expected: ConversionResult) => void;
}

const PARSER = new DOMParser();
const parse = (xmlString: string): Document =>
  PARSER.parseFromString(xmlString, "text/xml");

const XML_DOCUMENT_FACTORY = parse("").implementation;
const createDocument = (qualifiedName: QualifiedName): XMLDocument =>
  XML_DOCUMENT_FACTORY.createDocument(null, qualifiedName);

const XML_DOCUMENT_NODE_FACTORY = parse("");
const createText = (text: string): Text =>
  XML_DOCUMENT_NODE_FACTORY.createTextNode(text);
const createElement = (name: string): Element =>
  XML_DOCUMENT_NODE_FACTORY.createElement(name);

describe("xmlToJson", () => {
  test("given unsupported node type, then returns undefined", () => {
    const xml = XML_DOCUMENT_NODE_FACTORY.createAttribute("test_attribute");
    const actual = xmlToJson(xml);
    expect(actual).toBeUndefined();
  });

  // #region document node tests

  const documentTestHelper = (qualifiedName: QualifiedName): TestHelper => {
    const expects = (expected: ConversionResult): void => {
      const xml = createDocument(qualifiedName);
      const actual = xmlToJson(xml);
      expect(actual).toEqual(expected);
    };
    return { expects };
  };

  describe("given empty document node, then returns empty json", () => {
    test("document node with null qualified name", () =>
      documentTestHelper(null).expects({}));
    test("document node with empty qualified name", () =>
      documentTestHelper("").expects({}));
  });

  test("given document node, then returns json", () =>
    documentTestHelper("foo").expects({}));

  // #endregion document node tests

  // #region text node tests

  const textTestHelper = (text: string): TestHelper => {
    const expects = (expected: ConversionResult): void => {
      const xml = createText(text);
      const actual = xmlToJson(xml);
      expect(actual).toEqual(expected);
    };
    return { expects };
  };

  test("given empty text node, then returns undefined", () =>
    textTestHelper("").expects(undefined));
  test("given text node, then returns text", () =>
    textTestHelper("text only").expects("text only"));

  // #endregion text node tests

  const elementTestHelper = (elementAsXmlString: string): TestHelper => {
    const expects = (expected: ConversionResult): void => {
      // replace all whitespace characters including newlines before opening tags
      // this allows writing human readable test data while still parsing as expected
      const trimmedString = elementAsXmlString.replace(/\s+</g, "<");
      const xml = parse(trimmedString).documentElement;
      const actual = xmlToJson(xml);
      expect(actual).toEqual(expected);
    };
    return { expects };
  };

  test("given empty element node, then returns empty json", () =>
    elementTestHelper("<test/>").expects({}));

  test("given empty element node, but has attributes, then returns only attributes", () =>
    elementTestHelper("<test foo='' hello='world' sum='42'/>").expects({
      __attr__: {
        foo: "",
        hello: "world",
        sum: "42",
      },
    }));

  test("given element node with single text child node, then returns text", () =>
    elementTestHelper("<test>foo bar</test>").expects("foo bar"));

  test("given element node with multiple text children nodes, then returns merged text", () => {
    const xml = createElement("test");
    xml.appendChild(createText(""));
    xml.appendChild(createText("hello"));
    xml.appendChild(createText(" "));
    xml.appendChild(createText("world"));

    const actual = xmlToJson(xml);

    expect(actual).toEqual("hello world");
  });

  test("given element node with single element child node, then returns json", () =>
    elementTestHelper(`
      <test>
        <foo/>
      </test>
    `).expects({
      foo: {},
    }));

  test("given element node with multiple element children nodes, then returns json", () =>
    elementTestHelper(`
      <test>
        <foo/>
        <hello>world</hello>
      </test>
    `).expects({
      foo: {},
      hello: "world",
    }));

  test("given element node with multiple element children nodes with same tag name, then returns json", () =>
    elementTestHelper(`
      <test>
        <fruit>apple</fruit>
        <fruit>banana</fruit>
        <fruit>cherry</fruit>
      </test>
    `).expects({
      fruit: ["apple", "banana", "cherry"],
    }));

  test("given element node with multiple children nodes of various types, then returns json", () =>
    elementTestHelper(`
      <test>
        <foo/>
        <hello>world</hello>
        text only
        <fruit>apple</fruit>
        <fruit>banana</fruit>
        <fruit>cherry</fruit>
        also this text
      </test>
    `).expects({
      foo: {},
      hello: "world",
      "#text": ["text only", "also this text"],
      fruit: ["apple", "banana", "cherry"],
    }));

  test("given element node with single attribute, then returns json with attribute", () =>
    elementTestHelper("<test foo='bar'>text only</test>").expects({
      __attr__: {
        foo: "bar",
      },
      "#text": "text only",
    }));

  test("given element node with multiple attributes, then returns json with attributes", () =>
    elementTestHelper(
      "<test foo='' hello='world' sum='42'>text only</test>"
    ).expects({
      __attr__: {
        foo: "",
        hello: "world",
        sum: "42",
      },
      "#text": "text only",
    }));

  test("given element node with mix of everything, then returns json", () =>
    elementTestHelper(`
      <test>
        <foo id='bar'/>
        <hello>world</hello>
        text only
        <fruit id='fruit-0' color='red'>
          <name>apple</name>
          <shape>sphere</shape>
        </fruit>
        <fruit id='fruit-1' color='yellow'>
          <name>banana</name>
          <shape>crescent moon</shape>
        </fruit>
        <fruit id='fruit-2' color='red'>
          <name>cherry</name>
          <shape>sphere</shape>
        </fruit>
        also this text
      </test>
    `).expects({
      foo: {
        __attr__: {
          id: "bar",
        },
      },
      hello: "world",
      "#text": ["text only", "also this text"],
      fruit: [
        {
          __attr__: {
            id: "fruit-0",
            color: "red",
          },
          name: "apple",
          shape: "sphere",
        },
        {
          __attr__: {
            id: "fruit-1",
            color: "yellow",
          },
          name: "banana",
          shape: "crescent moon",
        },
        {
          __attr__: {
            id: "fruit-2",
            color: "red",
          },
          name: "cherry",
          shape: "sphere",
        },
      ],
    }));
});
