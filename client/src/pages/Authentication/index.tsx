import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export interface AuthProps {
  switchPage: () => void;
  onSubmit: (obj: { balance: number }) => void;
}

const AuthenticationPage = (props: {
  onSubmit: (obj: { balance: number }) => void;
}) => {
  const [page, setPage] = useState("register");
  if (page === "login") {
    return (
      <Login
        switchPage={() => {
          setPage("register");
        }}
        onSubmit={props.onSubmit}
      />
    );
  } else {
    return (
      <Register
        switchPage={() => {
          setPage("login");
        }}
        onSubmit={props.onSubmit}
      />
    );
  }
};

export default AuthenticationPage;
