import { SetStateAction, useState } from "react";
import { CEOStorage, DepartmentStorage, EmployeeStorage, TeamsStorage, hierarchy } from "../constants";
import { setItem } from "../service/storageService";
import "../styles.css";

export default function CEOPage({changeScreen}: { changeScreen: any; }) {
  const [CEO, setCEO] = useState("");

  function changeCEO(event: { target: { value: SetStateAction<string>; }; }) {
    setCEO(event.target.value);
  }
  function setLocalCEO() {
    setItem(CEOStorage, CEO);
    setItem(TeamsStorage, []);
    setItem(DepartmentStorage, []);
    setItem(EmployeeStorage, []);
    changeScreen(hierarchy);
  }
  return (
    <div className="App">
          <h1>Add CEO</h1>
          <input
            value={CEO}
            type="text"
            className="input"
            maxLength={25}
            placeholder="CEO"
            onChange={changeCEO}
            name="name"
          />
          <button className="primary-button" onClick={() => setLocalCEO()}>Submit</button>
        </div>
  );
}
