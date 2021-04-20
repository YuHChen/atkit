import React from "react";

import Loading from "../data/Loading";

import JsonView from "./JsonView";
import TableListView from "./TableListView";
import type { Json } from "./types";

interface DataDumperProps {
  data?: Json;
}

const DataDumper: React.FC<DataDumperProps> = ({ data }: DataDumperProps) => (
  <Loading loading={null === data || undefined === data}>
    <JsonView json={data!} />
    <TableListView json={data!} />
  </Loading>
);

export default DataDumper;
