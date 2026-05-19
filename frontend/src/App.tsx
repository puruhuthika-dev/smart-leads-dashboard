// frontend/src/App.tsx

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";


function App() {
  // CHECK TOKEN

  const token =
    localStorage.getItem(
      "token"
    );

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN PAGE */}

        <Route
          path="/"
          element={
            token ? (
              <Navigate
                to="/dashboard"
              />
            ) : (
              <Login />
            )
          }
        />

        {/* PROTECTED DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;