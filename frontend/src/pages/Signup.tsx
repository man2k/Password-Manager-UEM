import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { storage } from "@neutralinojs/lib";
import { copyToClipB } from "../utils/Utilities";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { generatePassword } from "../utils/Utilities";

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCpassword] = useState<string>("");
  const [eye, setEye] = useState<"password" | "text">("password");

  const handlePasswordGen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newp = generatePassword(16);
    setPassword(newp);
    setCpassword(newp);
  };
  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    copyToClipB(password);
  };
  const handleVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (eye === "password") {
      setEye("text");
    } else if (eye === "text") {
      setEye("password");
    }
  };

  const hashPassword = (passphrase: string, salt: string) => {
    const keys = CryptoJS.PBKDF2(passphrase, salt, {
      keySize: 512 / 32,
      iterations: 10000,
    });

    return keys.toString(CryptoJS.enc.Hex);
  };

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
      // toast("getting in");
      storage.getKeys().then((e) => {
        toast(e);
      });
      const u = await storage.getKeys();
      if (u.includes(username)) {
        toast(
          <div className="text-sm">
            Username is taken! Please use another username.
          </div>
        );
        return;
      }
      const salt = CryptoJS.lib.WordArray.random(128 / 8);
      const hashPass = hashPassword(password, salt.toString(CryptoJS.enc.Hex));
      // toast(hashPass);
      await storage
        .setData(
          username,
          JSON.stringify({
            id: uuidv4(),
            username: username,
            password: hashPass,
            salt: salt.toString(CryptoJS.enc.Hex),
          })
        )
        .then((e) => {
          console.log(e);
          // toast("signed up");
          toast("You are signed up!");
        });
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
            <div className="flex flex-row relative">
              <button
                onClick={handlePasswordGen}
                className="absolute right-1 mt-5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 stroke-violet-300 stroke-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </button>
              <button onClick={handleCopy} className="absolute right-6 mt-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 stroke-violet-300 stroke-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </button>
              <button
                onClick={handleVisibility}
                className="absolute right-11 mt-5"
              >
                {eye === "password" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 stroke-violet-300 stroke-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 stroke-violet-300 stroke-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
              <input
                type={eye}
                className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium bg-slate-600"
                placeholder="Password"
                value={password}
                onChange={handlePassword}
              />
            </div>
            <input
              id="cpassword"
              type="password"
              className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium bg-slate-600"
              placeholder="Confirm password"
              value={cpassword}
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

          <p className="text-center mt-3 text-[14px] text-indigo-200 font-mono">
            Already have an account?
            <br />
            <Link to="/login" className="text-indigo-300 font-bold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
