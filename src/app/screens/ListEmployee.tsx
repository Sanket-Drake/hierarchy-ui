import { useEffect, useState } from "react";
import { EmployeeStorage, hierarchy } from "../constants";
import { getItem } from "../service/storageService";
import "../styles.css";

export default function ListEmployee({changeScreen}) {
  const employees = JSON.parse(getItem(EmployeeStorage));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState();
  const [filters, setFilters] = useState({
    name: undefined,
    phone: undefined,
    email: undefined
  });
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  function setEmpName(event) {
    setName(event.target.value);
    if (event.target.value) {
      setFilters({ ...filters, name: event.target.value });
    } else {
      setFilters({ ...filters, name: undefined });
    }
  }

  function resetFilters() {
    setFilters({
      name: undefined,
      phone: undefined,
      email: undefined
    })
    setEmail('');
    setPhone(0);
    setName('');
  }

  function setEmpEmail(event) {
    setEmail(event.target.value);
    if (event.target.value) {
      setFilters({ ...filters, email: event.target.value });
    } else {
      setFilters({ ...filters, email: undefined });
    }
  }

  function setEmpPhone(event) {
    setPhone(event.target.value);
    if (event.target.value) {
      setFilters({ ...filters, phone: event.target.value });
    } else {
      setFilters({ ...filters, phone: undefined });
    }
  }

  useEffect(() => {

    const users = employees?.filter(function (item: { [x: string]: any; }) {
      for (var key in filters) {
        if (filters[key] !== undefined) {
          if ((key == 'name' || key == 'email' || key == 'phone') && (String(item[key].toLowerCase()).search(filters[key].toLowerCase()) >= 0)) {
            return true;
          }
          return false;
        }
      }
    });

    console.log(users);
    
    setFilteredEmployees(users);
  }, [filters])

  return (
    <div className="App">
      <table>
        <tr>
          <th>Name</th>
          <th>Department</th>
          <th>Team</th>
          <th>Lead</th>
          <th>Phone</th>
          <th>Email</th>
        </tr>
        <tr>
          <th>
            <input
              value={name}
              type="text"
              className="input"
              autoComplete="nope"
              maxLength="25"
              placeholder="name"
              onChange={setEmpName}
              name="name"
            />
          </th>
          <th>
            
          </th>
          <th>
            
          </th>
          <th>
            {/* <input
              value={lead}
              checked={lead}
              type="checkbox"
              className="input"
              onChange={setEmpLead}
              name="lead"
            /> */}
          </th>
          <th>
            <input
              value={phone}
              type="text"
              className="input"
              autoComplete="nope"
              maxLength="25"
              placeholder="phone"
              onChange={setEmpPhone}
              name="phone"
            />
          </th>
          <th>
            <input
              value={email}
              type="text"
              className="input"
              autoComplete="nope"
              maxLength="25"
              placeholder="email"
              onChange={setEmpEmail}
              name="email"
            />
          </th>
        </tr>
        {filteredEmployees.map((employee: { name: string; lead: boolean; phone: number; email: string; department: number; team: number; }) => (
          <tr>
            <td>{employee.name}</td>
            <td>{employee.department}</td>
            <td>{employee.team}</td>
            <td>{employee.lead ? "Yes" : "No"}</td>
            <td>{employee.phone}</td>
            <td>{employee.email}</td>
          </tr>
        ))}
      </table>
      <button className="primary-button" onClick={() => resetFilters()}>Reset Filters</button>
      <button className="primary-button" onClick={() => changeScreen(hierarchy)}>Go Back</button>
    </div>
  );
}
