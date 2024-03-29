import { useState } from "react";
import { useDrag } from 'react-dnd'
import {  addEditTeamMember } from "../constants";
import "../styles.css";

export default function Employee({ changeScreen, member, removeMember, type, name, key }: { changeScreen: any; member: any; removeMember: any; type: string; name: string; key: string;}) {
  const [temp, drag] = useDrag(
    () => ({
      type,
      item: { name }
    }),
    [name, type]
  );
  

  return (
    <div key={key} ref={drag} className="employee-box" data-testid="box">
        <h4>{member.name} - Team member 
          <span>
            <button className="edit-button" onClick={() => changeScreen(addEditTeamMember, {...member})}>edit</button>
            <button className="edit-button" onClick={() => removeMember(member)}>remove</button>
          </span>
        </h4>
      </div>
  );
}
