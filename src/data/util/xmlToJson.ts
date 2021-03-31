export type ConvertedText = string | undefined;
export type ConvertedJson = { [key: string]: any };
export type ConvertedAttributesJson = { [key: string]: string | null };
export type ConversionResult = ConvertedText | ConvertedJson | null;

const xmlToJson = (xml: Node): ConversionResult => {
  switch (xml.nodeType) {
    case Node.DOCUMENT_NODE:
      return documentToJson(xml as Document);
    case Node.TEXT_NODE:
      return textToJson(xml as Text);
    case Node.ELEMENT_NODE:
      return elementToJson(xml as Element);
    default:
      return undefined;
  }
};

const textToJson = (text: Text): ConvertedText => {
  const trimmedText = text.nodeValue?.trim();

  return undefined === trimmedText || 0 === trimmedText.length
    ? undefined
    : trimmedText;
};

const documentToJson = (doc: Document): ConversionResult => {
  const docElement = doc.documentElement;

  return null === docElement || undefined === docElement
    ? docElement
    : elementToJson(docElement);
};

const elementToJson = (element: Element): ConvertedText | ConvertedJson => {
  const json: ConvertedJson = {};

  // 1. convert attributes
  if (element.hasAttributes()) {
    json["__attr__"] = attributesToJson(element.attributes);
  }

  // 2. convert child nodes
  // normalize to merge multiple text nodes and remove empty text nodes
  element.normalize();
  const children = element.childNodes;

  if (!element.hasAttributes() && childrenIsOnlySingleText(children)) {
    // normalized element looks like `<data>text</data>`
    // if root, then key is ignored
    // if not root, then key is already handled upstream, so return text
    return textToJson(children.item(0) as Text);
  } else {
    Object.assign(json, childrenToJson(children));
  }

  return json;
};

const attributesToJson = (
  attributes: NamedNodeMap
): ConvertedAttributesJson => {
  const attributesJson: ConvertedAttributesJson = {};

  for (let i = 0; i < attributes.length; i++) {
    // note: using `[i]` instead of `.item(i)`.
    // since `item` has type `Attr | null`, typescript will force us to add a null check,
    // but we know for a fact that `item` cannot return `null` since we are looping over
    // `attributes`'s length.
    const attribute = attributes[i];
    attributesJson[attribute.nodeName] = attribute.nodeValue;
  }

  return attributesJson;
};

const childrenIsOnlySingleText = (children: NodeListOf<ChildNode>): boolean =>
  1 === children.length && Node.TEXT_NODE === children.item(0).nodeType;

const childrenToJson = (children: NodeListOf<ChildNode>): ConvertedJson => {
  const json: ConvertedJson = {};

  for (let i = 0; i < children.length; i++) {
    const child = children.item(i);
    const key = child.nodeName;
    const value = xmlToJson(child);
    if ("undefined" === typeof json[key]) {
      // `key` has not been encountered yet
      json[key] = value;
    } else {
      // `key` was previously parsed
      if ("undefined" === typeof json[key].push) {
        // existing value is not array-like, so change to array
        json[key] = [json[key]];
      }
      // existing value is an array, so append
      json[key].push(value);
    }
  }

  return json;
};

export default xmlToJson;
