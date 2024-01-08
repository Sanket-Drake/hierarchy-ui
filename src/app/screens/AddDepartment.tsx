import { SetStateAction, useState } from "react";
import { DepartmentStorage, hierarchy } from "../constants";
import { getItem, setItem } from "../service/storageService";
import "../styles.css";

export default function AddDepartment({ changeScreen }: { changeScreen: any; }) {
  const [name, setName] = useState("");
  const [warning, setWarning] = useState('');
  function setDeptName(event: { target: { value: SetStateAction<string>; }; }) {
      setName(event.target.value);
  }

  function addDept() {
    let localDepartment = JSON.parse(getItem(DepartmentStorage)) || [];
    const filteredDept = localDepartment?.filter(
      (dept: { name: string; }) => dept.name == name
    );
    if (filteredDept?.length) {
      setWarning("Department already added")
    }
    else {
      const id = localDepartment.length + 1;
      localDepartment.push({ name, id });
      setItem(DepartmentStorage, localDepartment);
      setName('')
    }
  }

  return (
    <div>
      <div className="Name">
        Department Name: 
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
      {warning?<div className="error">{warning}</div>: null}
      <button className="primary-button" onClick={() => addDept()}>Submit</button>
      <button className="primary-button" onClick={() => changeScreen(hierarchy)}>Cancel</button>
    </div>
  );
}
