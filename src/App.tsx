import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Auth from "./Midl/Auth/auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Auth />} />
        <Route path="/*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
