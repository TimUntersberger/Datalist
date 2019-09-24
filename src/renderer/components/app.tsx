import React, { useState, useEffect } from "react";
import SqlManager from "../sqlManager";
import { useAsync } from "react-async-hook";
import DatabaseIcon from "./DatabaseIcon";
import styled from "styled-components";
import ArrowDropdownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import TableIcon from "./TableIcon";
import FunctionIcon from "./FunctionIcon";

const DatabaseWrapper = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background-color: ${props => (props.isActive ? "#eeeeee" : "white")};
`;

const DatabaseName = styled.span`
  font-size: 0.8em;
  margin-top: 5px;
  font-weight: lighter;
  color: black;
  text-align: center;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
`;

type DatabaseProps = {
  db: string;
  isActive: boolean;
  onClick: (event: any) => void;
};

const Database: React.FC<DatabaseProps> = ({ db, isActive, onClick }) => (
  <DatabaseWrapper isActive={isActive} onClick={onClick}>
    <DatabaseIcon height={24} width={24}></DatabaseIcon>
    <DatabaseName>{db}</DatabaseName>
  </DatabaseWrapper>
);

const DatabasesSidebar = styled.div`
  width: 70px;
  height: 100vh;
  border-right: 1px solid lightgrey;
`;

const AppWrapper = styled.div`
  display: flex;
`;

const DatabaseObjectsSidebarWrapper = styled.div`
  width: 250px;
  border-right: 1px solid lightgrey;
`;

const DatabaseObjectGroupWrapper = styled.div`
  padding: 5px;
`;

const DatabaseObjectGroupHeader = styled.div`
  display: flex;
  font-size: 0.8em;
  font-weight: 500;
  align-items: center;
`;

const DatabaseObjectGroupItem = styled.div`
  display: flex;
  margin-left: 40px;
`;

const DatabaseObjectGroupItemName = styled.span`
  font-size: 0.8em;
  margin-left: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  align-content: center;
`;

type DatabaseObjectGroupProps = {
  header: string;
  items: string[];
  Icon: any;
};
const DatabaseObjectGroup: React.FC<DatabaseObjectGroupProps> = ({
  header,
  items,
  Icon
}) => {
  return (
    <DatabaseObjectGroupWrapper>
      <DatabaseObjectGroupHeader>
        <ArrowDropdownIcon></ArrowDropdownIcon>
        {header}
      </DatabaseObjectGroupHeader>
      {items.map(item => (
        <DatabaseObjectGroupItem key={item}>
          <Icon width={14} height={14}></Icon>
          <DatabaseObjectGroupItemName>{item}</DatabaseObjectGroupItemName>
        </DatabaseObjectGroupItem>
      ))}
    </DatabaseObjectGroupWrapper>
  );
};

type DatabaseObjectsSidebarProps = {
  objects: any[];
};
const DatabaseObjectsSidebar: React.FC<DatabaseObjectsSidebarProps> = ({
  objects
}) => {
  const tables: string[] = [];
  const functions: string[] = [];
  if (objects)
    objects.forEach(o => {
      if (o.type === "table") tables.push(o.name);
      else if (o.type === "function") functions.push(o.name);
    });
  return (
    <DatabaseObjectsSidebarWrapper>
      <DatabaseObjectGroup
        header="Tables"
        items={tables}
        Icon={TableIcon}
      ></DatabaseObjectGroup>
      <DatabaseObjectGroup
        header="Functions"
        items={functions}
        Icon={FunctionIcon}
      ></DatabaseObjectGroup>
    </DatabaseObjectsSidebarWrapper>
  );
};

export default function App() {
  const [selectedDatabase, setSelectedDatabase] = useState("test");
  const [databases, setDatabases] = useState([]);
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    SqlManager.connect({
      host: "localhost",
      port: 3306,
      username: "root",
      password: "teamtengu1",
      database: selectedDatabase
    });

    SqlManager.getDatabases().then(x => setDatabases(x as any));
    SqlManager.getObjects().then(x => setObjects(x as any));
  }, [selectedDatabase]);

  return (
    <AppWrapper>
      <DatabasesSidebar>
        {databases.map(db => (
          <Database
            key={db}
            db={db}
            onClick={() => setSelectedDatabase(db)}
            isActive={db === selectedDatabase}
          ></Database>
        ))}
      </DatabasesSidebar>
      <DatabaseObjectsSidebar objects={objects}></DatabaseObjectsSidebar>
    </AppWrapper>
  );
}
