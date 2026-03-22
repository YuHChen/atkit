import React from "react";
import { Badge } from "react-bootstrap";
import type { BadgeProps } from "react-bootstrap";

import { getDefinedKeys, handleJson } from "./jsonUtils";
import type { Handlers } from "./jsonUtils";
import { Json, JsonArray, JsonObject } from "./types";

import "./tableListView.scss";

const INDENT = (indent: number) => "".padStart(indent * 2, "-");
const NOTHING_TO_SEE = (key: string, indent: number) => (
  <p key={key}>{INDENT(indent)} Nothing to see here...</p>
);

interface InstancesBadgeProps extends BadgeProps {
  count: number;
  additionalContext?: string;
}

const InstancesBadge: React.FC<InstancesBadgeProps> = ({
  count,
  additionalContext = "",
  ...badgeProps
}: InstancesBadgeProps) => (
  <React.Fragment>
    <Badge {...{ variant: "dark", ...badgeProps }}>{count}</Badge>
    <span className="sr-only">{additionalContext}</span>
  </React.Fragment>
);

interface TableViewProps {
  title: string;
  indent: number;
  array: JsonArray;
}

const renderTable = (title: string, indent: number, array: JsonArray) => {
  const otherContent: React.JSX.Element[] = [];
  const tableJsonObjects: JsonObject[] = [];
  const uniqueFields = new Set();
  const fieldCounts = new Map();

  const handlers: (index: number) => Handlers = (index: number) => {
    const handlerTitle = `${title}-${index}`;
    return {
      nullHandler: () =>
        otherContent.push(NOTHING_TO_SEE(handlerTitle, indent)),
      primativeHandler: (primative) =>
        otherContent.push(
          <p key={handlerTitle}>
            {INDENT(indent)} {handlerTitle}: {primative}
          </p>,
        ),
      arrayHandler: (array) =>
        otherContent.push(
          <TableView
            key={handlerTitle}
            title={handlerTitle}
            indent={indent + 1}
            array={array}
          />,
        ),
      objectHandler: (obj) => {
        tableJsonObjects.push(obj);
        for (const key of getDefinedKeys(obj)) {
          uniqueFields.add(key);

          if (obj[key]) {
            const count = fieldCounts.get(key) || 0;
            fieldCounts.set(key, count + 1);
          }
        }
      },
    };
  };

  array.forEach((json, index) => {
    console.debug(`rendering table for ${title} ${index}`);
    handleJson(json, handlers(index));
  });

  const columns = Array.from(uniqueFields) as string[];
  const table = (
    <div className="atkit-table table-responsive">
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="atkit-th atkit-th-sticky">
                {col} <InstancesBadge count={fieldCounts.get(col)} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableJsonObjects.map((json, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={`${col}-${index}`}>{JSON.stringify(json[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <React.Fragment>
      {otherContent}
      {table}
    </React.Fragment>
  );
};

const TableView: React.FC<TableViewProps> = ({
  title,
  indent,
  array,
}: TableViewProps) => (
  <div className="atkit-table-view">
    <h2 key={title}>
      {INDENT(indent)} {title} <InstancesBadge count={array.length} />
    </h2>
    {renderTable(title, indent, array)}
  </div>
);

interface TableListViewProps {
  json: Json;
  title?: string;
}

const renderTableList = (
  json: Json,
  title: string = "raw data",
  indent = 0,
) => {
  let tableList: React.JSX.Element = <React.Fragment />;

  handleJson(json, {
    nullHandler: () => (tableList = NOTHING_TO_SEE(title, indent)),
    primativeHandler: (primative) =>
      (tableList = (
        <p key={title}>
          {INDENT(indent)} {title}: {primative}
        </p>
      )),
    arrayHandler: (array) =>
      (tableList = (
        <TableView key={title} title={title} indent={indent} array={array} />
      )),
    objectHandler: (obj) =>
      (tableList = (
        <React.Fragment key={title}>
          <h2>
            {INDENT(indent)} {title}
          </h2>
          {getDefinedKeys(obj).map((key) =>
            renderTableList(obj[key], key, indent + 1),
          )}
        </React.Fragment>
      )),
  });

  return tableList;
};

const TableListView: React.FC<TableListViewProps> = ({
  json,
  title,
}: TableListViewProps) => (
  <div className="atkit-table-list">{renderTableList(json, title)}</div>
);

export default TableListView;
