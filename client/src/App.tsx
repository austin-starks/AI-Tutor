import { BrowserRouter } from "react-router-dom";
import Router from "./router";

function App() {
  console.log("App render");
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
