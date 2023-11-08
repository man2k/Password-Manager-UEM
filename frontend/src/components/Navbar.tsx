import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="min-w-full h-14 bg-inherit text-indigo-300 text-2xl font-thin font-sans">
      <div className="w-full flex justify-center items-center pt-2">
        <Link
          to="/"
          className="border-[1px] border-indigo-400 rounded-md mt-2 p-1 bg-stone-900 hover:bg-indigo-400 hover:text-black absolute"
        >
          Home
        </Link>
        <button
          onClick={() => {
            isAuthenticated ? logout() : navigate("/login");
          }}
          className="border-[1px] border-indigo-400 rounded-md mt-[5px] p-1 bg-stone-900 hover:bg-indigo-400 hover:text-black text-xs ml-auto mr-2"
        >
          {isAuthenticated ? "Logout" : "Log In"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
