import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/LoginForm";
import SignUp from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Superfluid from "./components/Superfluid";
import CreateFlow from "./components/CreateFlow";
import UpdateFlow from "./components/UpdateFlow";
import DeleteFlow from "./components/DeleteFlow";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superfluid"
          element={
            <ProtectedRoute>
              <Superfluid />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superfluid/createflow"
          element={
            <ProtectedRoute>
              <CreateFlow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superfluid/updateflow"
          element={
            <ProtectedRoute>
              <UpdateFlow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superfluid/deleteflow"
          element={
            <ProtectedRoute>
              <DeleteFlow />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
