import { Key, useEffect, useState } from "react";
import { DepartmentStorage, EmployeeStorage, TeamsStorage, hierarchy } from "../constants";
import "../styles.css";
import { getItem, setItem } from "../service/storageService";

export default function AddEditTeamMember({ changeScreen, data }) {
  const departments = JSON.parse(getItem(DepartmentStorage));
  const teams = JSON.parse(getItem(TeamsStorage));
  const [deptTeams, setDepartmentTeams] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(0);
  const [ID, setID] = useState(0);
  const [errorEntry, setError] = useState("");
  const [lead, setLead] = useState(false);
  const [department, setDepartment] = useState(departments?.[0].id || 0);
  const [team, setTeam] = useState(teams?.[0].id || 0);

  useEffect(
    () => {
      if (data && Object.keys(data).length !== 0) {
        setName(data.name);
        setPhone(data.phone);
        setEmail(data.email);
        setTeam(data.team);
        setDepartment(data.department);
        setLead(data.lead);
        setID(data.id);
      }
    }, []);
  
  useEffect(
    () => {
        const filteredTeams = teams?.filter((team: { departmentId: Number; }) => team.departmentId == department);
        setDepartmentTeams(filteredTeams);
        setTeam(filteredTeams?.[0].id || 0)
    }, [department])
    
  function setEmpName(event) {
    setName(event.target.value);
    setError("");
  }

  function setEmpEmail(event) {
    setEmail(event.target.value);
    setError("");
  }

  function setEmpPhone(event) {
    setPhone(event.target.value);
    setError("");
  }

  function setEmpLead() {
    setLead(!lead);
    setError("");
  }

  function checkDuplication(employees: any[]) {
    const filteredEmp = employees?.filter((employee: { phone: Number; }) => employee.phone == phone);
    const filteredEMP = employees?.filter((employee: { email: String; }) => employee.email == email);
    const filteredLead = employees?.filter((employee: { lead: Boolean; team: Number; }) => employee.lead == true && employee.team == team);
    if (data?.id && filteredEmp?.length <= 1 && filteredEMP?.length <= 1) {
      const filterOutEditUser = filteredLead?.filter((employee: { id: Number; }) => employee.id !== ID);
      const filterOutEditUserEmail = filteredEMP?.filter((employee: { id: Number; }) => employee.id !== ID);
      const filterOutEditUserPhone = filteredEmp?.filter((employee: { id: Number; }) => employee.id !== ID);
      if (filterOutEditUserEmail?.length > 0 || filterOutEditUserPhone?.length > 0) {
        setError("Phone or Email already exists");
        return false;
      }
      if(lead && filterOutEditUser?.length) {
        setError("Team Lead already exists");
        return false;
      }
      return true;
    }
    
    if(filteredEmp?.length || filteredEMP?.length){
        setError("User already exists");
        return false;
    }
    else if(lead && filteredLead?.length) {
        setError("Team Lead already exists");
        return false;
    }
    return true;
  }

  function addEmp() {
    let employees = JSON.parse(getItem(EmployeeStorage)) || [];
    if(checkDuplication(employees)) {
      if (ID) {
        let employeeIndex = employees.findIndex((x: { id: number; }) => x.id == ID);
        employees[employeeIndex] = { id: ID, name, email, phone, lead, team, department  };
      }
      else {
        const id = employees.length + 1;
        employees.push({ id, name, email, phone, lead, team, department  });
      }
      setError("");
      setItem(EmployeeStorage, employees);
      changeScreen(hierarchy)
    }
  }

  function setEmpDepartment(event: { target: { value: SetStateAction<number>; }; }) {
    setDepartment(parseInt(event.target.value));
    const filteredTeams = teams?.filter((team: { departmentId: Number; }) => team.departmentId == event.target.value);
    if(filteredTeams?.length)
        setTeam(parseInt(filteredTeams?.[0].id));
    setError("");
  }

  function setEmpTeam(event: { target: { value: SetStateAction<number>; }; }) {
    setTeam(parseInt(event.target.value));
    setError("");
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
          maxLength="25"
          placeholder="name"
          onChange={setEmpName}
          name="name"
        />
      </div>
      <div className="Phone">
        <h1>Phone</h1>
        <input
          value={phone}
          type="text"
          className="input"
          maxLength="25"
          placeholder="phone"
          onChange={setEmpPhone}
          name="phone"
        />
      </div>
      <div className="Email">
        <h1>Email</h1>
        <input
          value={email}
          type="text"
          className="input"
          maxLength="25"
          placeholder="email"
          onChange={setEmpEmail}
          name="email"
        />
      </div>
      <div className="Email">
        <label>Team Lead</label>
        <input
          value={lead}
          checked={lead}
          type="checkbox"
          className="input"
          onChange={setEmpLead}
          name="lead"
        />
      </div>
      <div className="Department">
      Department:{" "}
        <select
          className="form-control department"
          value={department}
          onChange={setEmpDepartment}
          disabled={ID}
        >
          {departments?.map((option: { id: Key | readonly string[] | null | undefined; name: any; }) => (
            <option
              key={option.id}
              value={option.id}
            >{`${option.name}`}</option>
          ))}
        </select>
      </div>
      <div className="Department">
        Team:{" "}
        <select
          className="form-control department"
          value={team}
          onChange={setEmpTeam}
        >
          {deptTeams?.map((option: { id: Key | readonly string[] | null | undefined; name: any; }) => (
            <option
              key={option.id}
              value={option.id}
            >{`${option.name}`}</option>
          ))}
        </select>
      </div>
      {errorEntry !=''? <div className="error">{errorEntry}</div>: ''}
      <button className="primary-button" onClick={() => addEmp()}>Submit</button>
    </div>
  );
}
