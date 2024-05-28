import { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AdminLogin from "./Components/AdminLogin";
import AdminPanel from "./Components/AdminPanel";
import ProposalDetail from "./Components/ProposalDetail";
import ProfileScreen from "./Components/ProfileScreen";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleLogin = (userData) => {
    sessionStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
    navigate("/");
  };
  return (
    <Routes>
      <Route path="/" element={<AdminPanel />} />
      <Route path="/carddetail/:id" element={<ProposalDetail />} />
      <Route path="/profiledetail/:id" element={<ProfileScreen />} />
      <Route
        path="/adminlogin"
        element={<AdminLogin handleLogin={handleLogin} />}
      />
    </Routes>
  );
}

export default App;
