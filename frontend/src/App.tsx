import { useContext } from "react";
import { Routes, Route, Navigate, RouteProps } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <main className="App bg-[url('../public/3.jpg')] bg-cover bg-scroll">
      <Navbar />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </main>
  );
}

const PublicRoute: React.FC<RouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "AuthContext is undefined, ensure it is within AuthProvider"
    );
  }

  const { isAuthenticated } = authContext;

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

const PrivateRoute: React.FC<RouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "AuthContext is undefined, ensure it is within AuthProvider"
    );
  }

  const { isAuthenticated } = authContext;

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default App;
