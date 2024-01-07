import { useState } from "react";
import { DepartmentStorage, hierarchy } from "../constants";
import { getItem, setItem } from "../service/storageService";
import "../styles.css";

export default function AddDepartment({ changeScreen }: { changeScreen: any; }) {
  const [name, setName] = useState("");
  function setDeptName(event) {
    setName(event.target.value);
  }
  function addDept() {
    let departments = JSON.parse(getItem(DepartmentStorage)) || [];
    const id = departments.length + 1;
    departments.push({ name, id });
    setItem(DepartmentStorage, departments);
  }
  return (
    <div>
      <button onClick={() => changeScreen(hierarchy)}>Go Back</button>
      <div className="Name">
        <h1>Department Name</h1>
        <input
          value={name}
          type="text"
          className="input"
          maxLength={25}
          placeholder="name"
          onChange={setDeptName}
          name="name"
        />
      </div>
      <button className="primary-button" onClick={() => addDept()}>Submit</button>
    </div>
  );
}
