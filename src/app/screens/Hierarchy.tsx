import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, useState } from "react";
import { addDepartment, addEditTeamMember, EmployeeStorage, listEmployee, TeamsStorage } from "../constants";
import { CEOStorage } from "../constants";
import { DepartmentStorage } from "../constants";
import { addEditTeam } from "../constants";
import { getItem, setItem } from "../service/storageService";
import "../styles.css";
import Employee from "../components/Employee";
import Team from "../components/Team";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default function Hierarchy({ changeScreen }: { changeScreen: any; }) {
  const CEO = getItem(CEOStorage);
  const departments = JSON.parse(getItem(DepartmentStorage));
  const teams = JSON.parse(getItem(TeamsStorage));
  // const employees = JSON.parse(getItem(EmployeeStorage));
  const [warning, setWarning] = useState('');
  const [employees, setEmployees] = useState(JSON.parse(getItem(EmployeeStorage)));

  function goToEmployee() {
    if (teams?.length)
      changeScreen(addEditTeamMember)
    else 
      setWarning("Add Team first to add employee")
  }

  function goToTeam() {
    if (departments?.length)
      changeScreen(addEditTeam)
    else 
      setWarning("Add Department first to add team")
  }

  function goToList() {
    if (employees?.length)
      changeScreen(listEmployee)
    else 
      setWarning("Add Employees first to see list")
  }

  function displayDepartments() {
    if (departments?.length)
      return departments?.map((department: { id: Number; name: string; }) => {
        return displayTeams(department);
      });
  }

  function removeMember(member: { name?: string; id?: any; }) {
    const employeeIndex = employees.findIndex((employee: { id: String; }) => employee.id == member.id)
    const tempEmp = [...employees];
    tempEmp.splice(employeeIndex,1);
    setEmployees(tempEmp);
    setItem(EmployeeStorage, employees)
  }

  function displayTeams(departmentObj: { id: Number; name: string; }) {
    const filteredTeams = teams?.filter(
      (team: { departmentId: Number; }) => team.departmentId == departmentObj.id
    );
    // if (filteredTeams?.length)
    return (
      <li>
        <h4>{departmentObj.name} - Department</h4>
        <ul>{filteredTeams?.length
          ? filteredTeams?.map((team: { id: Number; departmentId: Number; }) => {
              // return (displayMembers(team))
              return <Team key={String(team.id)} employees={employees} removeMember={removeMember} team={team} changeScreen={changeScreen} type={String(team.departmentId)} />
            })
          : null}
          </ul>
      </li>
    );
  }

  return (
    
    <div className="home">
      <DndProvider backend={HTML5Backend}>
      <div className="hierarchy">
        <h1>Hierarchy</h1>
        <button className="primary-button" onClick={() => changeScreen(addDepartment)}>
          Add Department
        </button>
        <button className="primary-button" onClick={() => goToTeam()}>Add Team</button>
        <button className="primary-button" onClick={() => goToEmployee()}>
          Add Employee
        </button>
        <button className="primary-button" onClick={() => goToList()}>
          Filter Employees
        </button>
      </div>
      {warning?<div className="error">{warning}</div>: null}
      <div className="ceo">CEO {CEO}</div>
      <ul>{displayDepartments()}</ul>
				</DndProvider>
    </div>
  );
}
