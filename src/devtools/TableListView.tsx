import React from "react";
import { Badge } from "react-bootstrap";
import type { BadgeProps } from "react-bootstrap";

import { getDefinedKeys, handleJson } from "./jsonUtils";
import type { Handlers } from "./jsonUtils";
import JsonView from "./JsonView";
import { Json, JsonArray, JsonObject } from "./types";

import "./tableListView.scss";

const NOTHING_TO_SEE = <p>Nothing to see here...</p>;

interface InstancesBadgeProps extends BadgeProps {
  count: number;
  additionalContext?: string;
}

const InstancesBadge: React.FC<InstancesBadgeProps> = ({
  count,
  additionalContext = "instances",
  ...badgeProps
}: InstancesBadgeProps) => (
  <React.Fragment>
    <Badge {...{ variant: "dark", ...badgeProps }}>{count}</Badge>
    <span className="sr-only">{additionalContext}</span>
  </React.Fragment>
);

interface TableViewProps {
  title: string;
  array: JsonArray;
}

const renderTable = (array: JsonArray) => {
  const otherContent: JSX.Element[] = [];
  const tableJsonObjects: JsonObject[] = [];
  const uniqueFields = new Set();
  const fieldCounts = new Map();

  const handlers: Handlers = {
    nullHandler: () => otherContent.push(NOTHING_TO_SEE),
    primativeHandler: (primative) => otherContent.push(<p>{primative}</p>),
    arrayHandler: (array) => otherContent.push(<JsonView json={array} />),
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

  for (const json of array) {
    handleJson(json, handlers);
  }

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
  array,
}: TableViewProps) => (
  <div className="atkit-table-view">
    <h2>
      {title} <InstancesBadge count={array.length} />
    </h2>
    {renderTable(array)}
  </div>
);

interface TableListViewProps {
  json: Json;
}

const renderTableList = (json: Json, title: string = "array data") => {
  let tableList: JSX.Element = <React.Fragment />;

  handleJson(json, {
    nullHandler: () => (tableList = NOTHING_TO_SEE),
    primativeHandler: (primative) => (tableList = <p>{primative}</p>),
    arrayHandler: (array) =>
      (tableList = <TableView key={title} title={title} array={array} />),
    objectHandler: (obj) =>
      (tableList = (
        <React.Fragment>
          {getDefinedKeys(obj).map((key) => renderTableList(obj[key], key))}
        </React.Fragment>
      )),
  });

  return tableList;
};

const TableListView: React.FC<TableListViewProps> = ({
  json,
}: TableListViewProps) => (
  <div className="atkit-table-list">{renderTableList(json)}</div>
);

export default TableListView;
