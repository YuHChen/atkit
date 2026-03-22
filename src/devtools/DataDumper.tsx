import React from "react";

import Loading from "../data/Loading";

import JsonView from "./JsonView";
import TableListView from "./TableListView";
import type { Json } from "./types";

interface DataDumperProps {
  data?: Json;
  title?: string;
  viewJson?: boolean;
}

const DataDumper: React.FC<DataDumperProps> = ({
  data,
  title,
  viewJson,
}: DataDumperProps) => (
  <Loading loading={null === data || undefined === data}>
    {viewJson && <JsonView json={data!} />}
    <TableListView json={data!} title={title} />
  </Loading>
);

export default DataDumper;
