import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "@neutralinojs/lib";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCpassword] = useState<string>("");

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleCpassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpassword(e.target.value);
  };
  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (username === "") {
      toast("No username has been provided");
    } else if (password === "" || cpassword === "") {
      toast("No password has been provided");
    } else if (password !== cpassword) {
      toast("Your passwords don't match");
    } else {
      const u = await storage.getKeys();
      // console.log(u);
      if (u.includes(username)) {
        toast(
          <div className="text-sm">
            Username is taken! Please use another username.
          </div>
        );
        return;
      }
      const salt = bcrypt.genSaltSync(14);
      console.log(salt);
      const hashPass = bcrypt.hashSync(password, salt);
      //   console.log(hashPass);
      // console.log(bcrypt.compareSync(password, hashPass));
      await storage.setData(
        username,
        JSON.stringify({ id: uuidv4(), username: username, password: hashPass })
      );
      toast("You are signed up!");
      //   const data = await storage.getKeys();
      //   console.log(data);
    }
  };

  return (
    <main className="min-h-screen min-w-full flex text-white justify-around">
      <div className="sm:pt-40 p-20 lg:mt-20">
        <h1 className="h-52 w-40 font-mono">
          <span className="text-indigo-300 text-3xl">
            <span className="text-sky-400 text-5xl">S</span>ign Up{" "}
          </span>{" "}
        </h1>
      </div>
      <div className="max-w-[280px] lg:mt-20">
        <div className="flex flex-col items-center mt-[10vh]">
          <form className="text-white font-mono mt-20 lg:mt-0">
            <input
              type="text"
              className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium bg-slate-600"
              placeholder="Username"
              onChange={handleUsername}
            />
            <input
              type="password"
              className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium bg-slate-600"
              placeholder="Password"
              onChange={handlePassword}
            />
            <input
              type="password"
              className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium bg-slate-600"
              placeholder="Confirm password"
              onChange={handleCpassword}
            />
            <button
              className="bg-cyan-800 hover:bg-indigo-500 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]"
              type="submit"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </form>
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
          <p className="text-center mt-3 text-[14px] text-indigo-200 font-mono">
            Already have an account?
            <br />
            <Link to="/login" className="text-indigo-300 font-bold">
              Log In
            </Link>
          </p>
          {/* <p className="text-center mt-3 text-[14px]">
            By clicking continue, you agree to our
            <a href="/terms" className="">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="">
              Privacy Policy
            </a>
            .
          </p> */}
        </div>
      </div>
    </main>
  );
};

export default Signup;
