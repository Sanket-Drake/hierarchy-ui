import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, useState } from "react";
import { addDepartment, addEditTeamMember, EmployeeStorage, listEmployee, TeamsStorage } from "../constants";
import { CEOStorage } from "../constants";
import { DepartmentStorage } from "../constants";
import { addEditTeam } from "../constants";
import { getItem, setItem } from "../service/storageService";
import "../styles.css";

export default function Hierarchy({ changeScreen }: { changeScreen: any; }) {
  const CEO = getItem(CEOStorage);
  const departments = JSON.parse(getItem(DepartmentStorage));
  const teams = JSON.parse(getItem(TeamsStorage));
  // const employees = JSON.parse(getItem(EmployeeStorage));
  const [employees, setEmployees] = useState(JSON.parse(getItem(EmployeeStorage)));


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
          ? filteredTeams?.map((team: { id: Number; }) => {
              return (displayMembers(team))
            })
          : null}
          </ul>
      </li>
    );
  }

  function displayMembers(teamObj: { id: any; name?: any; }) {
    const filteredMembers = employees?.filter((member: { team: Number; }) => member.team == teamObj.id);
    const filteredNonLeadMembers = filteredMembers?.filter((member: { lead: boolean; }) => !member.lead);
    const teamLead = filteredMembers?.filter((member: { lead: boolean; }) => member.lead);
    return (
      <li>
        <h4>{teamObj.name} - Team <span><button className="edit-button" onClick={() => changeScreen(addEditTeamMember, {...teamObj})}>edit</button></span></h4>
        <ul>
        {teamLead?.[0] ? <li><h4>{teamLead?.[0].name} - Team Lead<span><button className="edit-button" onClick={() => changeScreen(addEditTeamMember, {...teamLead?.[0]})}>edit</button><button className="edit-button" onClick={() => removeMember(teamLead)}>remove</button></span></h4></li> : null}
          {filteredNonLeadMembers?.length
          ? filteredNonLeadMembers?.map((member: any) => {
              return displayMember(member);
            })
          : null}
          </ul>
      </li>
    );
  }

  function displayMember(member: { name: string; }) {
    return (
      <li>
        <h4>{member.name} - Team member <span><button className="edit-button" onClick={() => changeScreen(addEditTeamMember, {...member})}>edit</button><button className="edit-button" onClick={() => removeMember(member)}>remove</button></span></h4>
      </li>
    );
  }

  return (
    <div className="home">
      <div className="hierarchy">
        <h1>Hierarchy</h1>
        <button className="primary-button" onClick={() => changeScreen(addDepartment)}>
          Add Department
        </button>
        <button className="primary-button" onClick={() => changeScreen(addEditTeam)}>Add Team</button>
        <button className="primary-button" onClick={() => changeScreen(addEditTeamMember)}>
          Add Employee
        </button>
        <button className="primary-button" onClick={() => changeScreen(listEmployee)}>
          Filter Employees
        </button>
      </div>
      <div className="ceo">CEO {CEO}</div>
      <ul>{displayDepartments()}</ul>
    </div>
  );
}
