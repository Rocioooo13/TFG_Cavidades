import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// import "bootstrap/dist/css/bootstrap.min.css";

// import UsersList from "./UserList";
import { App } from "./components/App";

ReactDOM.render(
  <React.StrictMode>
    {/* <UsersList /> */}
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
