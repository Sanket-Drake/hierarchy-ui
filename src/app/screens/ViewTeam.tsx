import { hierarchy } from "../constants";
import "../styles.css";

export default function ListEmployee({changeScreen}: { changeScreen: any; }) {
  return (
    <div className="App">
      <button className="primary-button" onClick={() => changeScreen(hierarchy)}>Go Back</button>
      <h1>Add Team Name</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
