import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./form";

import Auth from "./Midl/Auth/auth";
import Role from "./Midl/roleBasedAuth/role";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Auth />} />
        <Route path="/role" element={<Role />} />
        <Route path="/form" element={<Index />} />
        <Route path="/*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
