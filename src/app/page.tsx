'use client';

import "./styles.css";
import { addDepartment, addEditTeam, ceoPage, hierarchy } from "./constants";
import { SetStateAction, useEffect, useState } from "react";
import { home } from "./constants";
import { addEditTeamMember } from "./constants";
import { viewTeam } from "./constants";
import { listEmployee } from "./constants";
import Hierarchy from "./screens/Hierarchy";
import AddEditTeamMember from "./screens/AddEditTeamMember";
import AddEditTeam from "./screens/AddEditTeam";
import ViewTeam from "./screens/ViewTeam";
import ListEmployee from "./screens/ListEmployee";
import { getItem, setItem } from "./service/storageService";
import { CEOStorage } from "./constants";
import AddDepartment from "./screens/AddDepartment";
import CEOPage from "./screens/CEOPage";

export default function App() {
  const [screen, changeScreens] = useState(home);
  const [data, changeData] = useState(null);

  function changeScreen(page: SetStateAction<string>, data: SetStateAction<null> | undefined) {
    if(data)
      changeData(data);
    else 
      changeData(null)
    changeScreens(page);
  }

  function showHierarchy() {
    const CEOLocal = getItem(CEOStorage);
    if(CEOLocal) 
      changeScreen(hierarchy);
    else 
      changeScreen(ceoPage)
  }
  switch (screen) {
    case hierarchy:
      return <Hierarchy changeScreen={changeScreen} />;
    case addEditTeam:
      return <AddEditTeam changeScreen={changeScreen} data={data} />;
    case addEditTeamMember:
      return <AddEditTeamMember changeScreen={changeScreen} data={data} />;
    case viewTeam:
      return <ViewTeam changeScreen={changeScreen} />;
    case listEmployee:
      return <ListEmployee changeScreen={changeScreen} />;
    case addDepartment:
      return <AddDepartment changeScreen={changeScreen} />;
    case ceoPage:
      return <CEOPage changeScreen={changeScreen} />;
    default: 
    return (
      <div className="App">
        <h1>Home</h1>
        <button className="primary-button" onClick={() => showHierarchy()}>Show Hierarchy</button>
      </div>
    );
  }
}
