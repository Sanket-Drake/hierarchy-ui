import { useEffect, useState } from "react";
import { EmployeeStorage, hierarchy } from "../constants";
import { getItem } from "../service/storageService";
import "../styles.css";

export default function ListEmployee({changeScreen}: { changeScreen: any; }) {
  const employees = JSON.parse(getItem(EmployeeStorage));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState();
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  function setEmpName(event: { target: { value: any; }; }) {
    setName(event.target.value);
    if (event.target.value) {
      setFilters({ ...filters, name: event.target.value });
    } else {
      setFilters({ ...filters, name: '' });
    }
  }

  function resetFilters() {
    setFilters({
      name: '',
      phone: '',
      email: ''
    })
    setEmail('');
    setPhone('');
    setName('');
  }

  function setEmpEmail(event: { target: { value: any; }; }) {
    setEmail(event.target.value);
    if (event.target.value) {
      setFilters({ ...filters, email: event.target.value });
    } else {
      setFilters({ ...filters, email: '' });
    }
  }

  function setEmpPhone(event: { target: { value: any; }; }) {
    setPhone(event.target.value);
    if (event.target.value) {
      setFilters({ ...filters, phone: event.target.value });
    } else {
      setFilters({ ...filters, phone: '' });
    }
  }

  useEffect(() => {
    const users = employees?.filter(function (item: { [x: string]: any; }) {
      for (var key in filters) {
        if (filters[key] !== '') {
          if ((key == 'name' || key == 'email' || key == 'phone') && (String(item[key].toLowerCase()).search(filters[key].toLowerCase()) >= 0)) {
            return true;
          }
          return false;
        }
      }
    });
    setFilteredEmployees(users);
  }, [filters, employees])

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
              maxLength={25}
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
              maxLength={25}
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
              maxLength={25}
              placeholder="email"
              onChange={setEmpEmail}
              name="email"
            />
          </th>
        </tr>
        {filteredEmployees.map((employee: { id: number; name: string; lead: boolean; phone: number; email: string; department: number; team: number; }) => (
          <tr key={employee.id}>
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
