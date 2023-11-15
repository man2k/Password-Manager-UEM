import { useState } from "react";
import { clipboard } from "@neutralinojs/lib";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
type UserDataFormat = {
  id: number;
  website: string;
  username: string;
  email: string;
  password: string;
  notes: string;
};

type UserTableDataProps = {
  udata: UserDataFormat;
};

const UserTableData: React.FC<UserTableDataProps> = ({ udata }) => {
  const [passOrText, setPassOrText] = useState<"password" | "text">("password");
  const [delPopup, setDelPopup] = useState<boolean>(false); //temporar

  const confirmModal = (c: boolean) => {
    setDelPopup(c);
  };
  const viewHidePass = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    passOrText == "password"
      ? setPassOrText("text")
      : setPassOrText("password");
  };

  const copyToClipB = async (text: string) => {
    // console.log(text);
    await clipboard.writeText(text);
    toast(<p className="text-md">copied to clipboard</p>);
  };

  return (
    <tbody className="bg-indigo-300" key={udata.id}>
      <tr className="border-b">
        <td key="website" className="px-6 py-4 whitespace-nowrap">
          {udata.website}
        </td>
        <td key="email" className="px-6 py-4 whitespace-nowrap">
          {udata.email}
          <button
            onClick={() => {
              copyToClipB(udata.username);
            }}
            className="ml-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
          </button>
        </td>
        <td key="password" className="px-6 py-4 whitespace-nowrap">
          <div className="flex-row">
            <input
              type={passOrText}
              value={udata.password}
              readOnly
              className="bg-inherit w-[120px] border-none focus:border-none focus:outline-none cursor-default"
            ></input>
            <button onClick={viewHidePass}>
              {passOrText == "password" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
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
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                copyToClipB(udata.password);
              }}
              className="ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                />
              </svg>
            </button>
          </div>
        </td>
        <td
          key="notes"
          className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-row justify-between"
        >
          <div>{udata.notes}</div>
          <div>
            <button
              onClick={() => {
                confirmModal(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500 hover:text-violet-800 hover:shadow-md"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {delPopup ? (
              <>
                <ConfirmationModal
                  setDelPopup={setDelPopup}
                  rowid={udata.id.toString()}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </td>
      </tr>
    </tbody>
  );
};

export default UserTableData;
