import { useEffect, useState, useContext } from "react";
import { generatePassword, copyToClipB } from "../utils/Utilities";
import { extensions } from "@neutralinojs/lib";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
type formDataType = {
  website: string;
  username: string;
  email: string;
  password: string;
  notes: string;
};

type Props = {
  // uuid: string;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewPasswordForm: React.FC<Props> = ({ setShowPopup }) => {
  const { uuid, pw } = useContext(AuthContext);
  useEffect(() => {
    return () => {
      clearForm();
    };
  }, []);
  const [formData, setFormData] = useState<formDataType>({
    website: "",
    username: "",
    email: "",
    password: "",
    notes: "",
  });
  const [passOrText, setPassOrText] = useState<string>("password");

  const addNewPassword = () => {
    extensions.dispatch(
      "password.manager.uem.nodeServer",
      "newPassword",
      JSON.stringify({
        uuid: uuid,
        mpassword: pw,
        website: formData.website,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        notes: formData.notes,
      })
    );
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password === "" || formData.website === "") {
      toast("Some required field are missing!");
      return;
    }
    addNewPassword();
    clearForm();
    setShowPopup(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name == "username") {
      setFormData({
        ...formData,
        [name]: value,
        ["email"]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const clearForm = () => {
    setFormData({
      website: "",
      username: "",
      email: "",
      password: "",
      notes: "",
    });
  };

  const handlePasswordGen = (gp: string) => {
    setFormData({
      ...formData,
      ["password"]: gp,
    });
  };

  const viewHidePass = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    passOrText == "password"
      ? setPassOrText("text")
      : setPassOrText("password");
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 text-white">
      <div className="bg-slate-800 rounded-lg p-5 w-[300px] h-[320px]">
        <form onSubmit={handleSubmit}>
          <div className="text-violet-300">
            <label htmlFor="website" className="block text-sm font-medium">
              Website
            </label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-indigo-400 text-black px-2 py-0.5"
            />
            <label
              htmlFor="username/email"
              className="block text-sm font-medium"
            >
              Username/Email
            </label>
            <input
              type="text"
              id="username/email"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-indigo-400 text-black px-2 py-0.5"
            />
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative flex flex-row gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handlePasswordGen(generatePassword(16));
                }}
                className="absolute right-0 mt-1.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 stroke-indigo-900"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipB(formData.password);
                }}
                className="absolute right-5 mt-1.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 stroke-indigo-900"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </button>
              <button
                onClick={viewHidePass}
                className="absolute right-10 mt-1.5"
              >
                {passOrText == "password" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 stroke-indigo-900"
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
                    className="w-5 h-5 stroke-indigo-900"
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
                type={passOrText}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-indigo-400 text-black px-2 py-0.5"
              />
            </div>
            <label htmlFor="notes" className="block text-sm font-medium">
              Notes
            </label>
            <input
              type="text"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-indigo-400 text-black px-2 py-0.5"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="text-indigo-300 border-[1px] border-indigo-400 rounded-md mt-2 p-1 bg-stone-900 hover:bg-indigo-400 hover:text-black"
            >
              Submit
            </button>
            <button
              type="button"
              className="text-indigo-300 border-[1px] border-indigo-400 rounded-md mt-2 p-1 bg-stone-900 hover:bg-indigo-400 hover:text-black"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordForm;
