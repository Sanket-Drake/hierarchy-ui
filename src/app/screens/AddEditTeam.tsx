import { SetStateAction, useEffect, useState } from "react";
import { DepartmentStorage, TeamsStorage, hierarchy } from "../constants";
import { getItem, setItem } from "../service/storageService";
import "../styles.css";

export default function AddEditTeam({ changeScreen, data }) {
  const departments = JSON.parse(getItem(DepartmentStorage));
  const [name, setName] = useState("");
  const [errorEntry, setError] = useState("");
  const [department, setDepartment] = useState(departments?.[0].id || 0);

  useEffect(
    () => {
      if (data && Object.keys(data).length !== 0) {
        setName(data.name);
      }
    }, [data]);

  function setTeamName(event: { target: { value: SetStateAction<string>; }; }) {
    setName(event.target.value);
  }
  function setTeamDepartment(event: { target: { value: SetStateAction<number>; }; }) {
    setDepartment(parseInt(event.target.value));
  }
  function addEditTeam() {
    let teams = JSON.parse(getItem(TeamsStorage)) || [];
    const filteredEmp = teams?.filter((team: { name: string; }) => team.name == name);
    if (filteredEmp?.length) {
      setError("Team name already exists")
    } else {
      const id = teams.length + 1;
      teams.push({ name, id, departmentId: department });
      setItem(TeamsStorage, teams);
    }
  }
  return (
    <div>
      <button className="primary-button" onClick={() => changeScreen(hierarchy)}>Go Back</button>
      <div className="Name">
        <h1>Name</h1>
        <input
          value={name}
          type="text"
          className="input"
          maxLength={25}
          placeholder="name"
          onChange={setTeamName}
          name="name"
        />
      </div>
      <div className="Department">
        <select
          className="form-control department"
          value={department}
          onChange={setTeamDepartment}
        >
          {departments?.map((option: { id: Key | readonly string[] | null | undefined; name: any; }) => (
            <option
              key={option.id}
              value={option.id}
            >{`${option.name}`}</option>
          ))}
        </select>
      </div>
      {errorEntry !=''? <div className="error">{errorEntry}</div>: ''}
      <button className="primary-button" onClick={() => addEditTeam()}>Submit</button>
    </div>
  );
}
