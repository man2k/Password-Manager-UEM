import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="min-w-full h-14 bg-gray-950 text-indigo-300 text-2xl font-thin font-sans">
      <div className="w-full flex justify-center items-center">
        <Link
          to="/"
          className="border-[1px] border-indigo-400 rounded-md mt-[5px] p-1 bg-stone-900 hover:bg-indigo-400 hover:text-black"
        >
          Home
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
