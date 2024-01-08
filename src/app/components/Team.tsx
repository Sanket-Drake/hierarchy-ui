import { useState } from "react";
import { useDrop } from 'react-dnd'
import {  addEditTeamMember } from "../constants";
import "../styles.css";
import Employee from "./Employee";

export default function Team({ changeScreen, team, removeMember, type, employees, key }: { changeScreen: any; team: any; removeMember: any; type: string;  employees: any; key: string;}) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: type,
    drop: () => ({ name: 'Dustbin' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))
  const isActive = canDrop;
  const filteredMembers = employees?.filter((member: { team: Number; }) => member.team == team.id);
  const filteredNonLeadMembers = filteredMembers?.filter((member: { lead: boolean; }) => !member.lead);
  const teamLead = filteredMembers?.filter((member: { lead: boolean; }) => member.lead);
  console.log('isactive', canDrop, isOver, type);

  return (
    <div key={key} className="employee-box" data-testid="dustbin">
        <li>
        <h4>{team.name} - Team <span><button className="edit-button" onClick={() => changeScreen(addEditTeamMember, {...team})}>edit</button></span></h4>
        <ul>
        {teamLead?.[0] ? <li><h4>{teamLead?.[0].name} - Team Lead<span><button className="edit-button" onClick={() => changeScreen(addEditTeamMember, {...teamLead?.[0]})}>edit</button><button className="edit-button" onClick={() => removeMember(teamLead)}>remove</button></span></h4></li> : null}
          {filteredNonLeadMembers?.length
          ? filteredNonLeadMembers?.map((member: any) => {
              // return displayMember(member);
              return <Employee key={String(member.id)} removeMember={removeMember} member={member} changeScreen={changeScreen} type={String(member.department)} name={member.name} />
            })
          : null}
          </ul>
      </li>
      {isActive?<div className="employee-box" ref={drop}> Drop here </div>:null}
      </div>
  );
}
