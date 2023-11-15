import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { extensions, storage } from "@neutralinojs/lib";

import CryptoJS from "crypto-js";
import { AuthContext } from "../context/AuthContext";

const login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useContext(AuthContext);

  const verifyPassword = (pass: string, hash: string, salt: string) => {
    const keys = CryptoJS.PBKDF2(pass, salt, {
      keySize: 512 / 32,
      iterations: 10000,
    });
    const enteredHash = keys.toString(CryptoJS.enc.Hex);
    return enteredHash === hash;
  };

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (username === "") {
      toast("No username has been provided");
      return;
    } else if (password === "") {
      toast("No password has been provided");
      return;
    } else {
      // toast("getting in");
      const k = await storage.getKeys();
      // toast(k.length);
      if (!k.includes(username)) {
        toast("Wrong Username or Password!");
      } else {
        const d = await storage.getData(username);
        const p = JSON.parse(d);
        // console.log(verifyPassword(password, p.password, p.salt));
        if (verifyPassword(password, p.password, p.salt)) {
          toast("You are Logged In!");
          extensions
            .dispatch(
              "password.manager.uem.nodeServer",
              "initDB",
              JSON.stringify({ uuid: p.id, password: password })
            )
            .then((e) => console.log(e));
          login(p.id, password);
        } else {
          toast("Wrong Username or Password!");
        }
      }
    }
  };

  return (
    <main className="min-h-screen min-w-full flex text-white justify-around ">
      <div className="sm:pt-40 p-20 lg:mt-20">
        <h1 className="h-52 w-40 font-mono">
          <span className="text-indigo-300 text-3xl">
            <span className="text-sky-400 text-5xl">L</span>ogin{" "}
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

            <button
              className="bg-cyan-800 hover:bg-indigo-500 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]"
              type="submit"
              onClick={handleLogin}
            >
              Log In
            </button>
          </form>

          <p className="text-center mt-3 text-[14px] text-indigo-200 font-mono">
            Don't have an account?
            <br />
            <Link to="/signup" className="text-indigo-300 font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default login;
