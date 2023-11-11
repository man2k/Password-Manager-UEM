import { extensions } from "@neutralinojs/lib";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
type Props = {
  setDelPopup: React.Dispatch<React.SetStateAction<boolean>>;
  rowid: string;
};

const ConfirmationModal: React.FC<Props> = ({ setDelPopup, rowid }) => {
  const { uuid, pw } = useContext(AuthContext);
  const handleDelete = () => {
    extensions
      .dispatch(
        "password.manager.uem.nodeServer",
        "deletePassword",
        JSON.stringify({
          uuid: uuid,
          rowid: rowid,
          password: pw,
        })
      )
      .then((e) => {
        console.log(e);
      });
    extensions.dispatch(
      "password.manager.uem.nodeServer",
      "readPrivData",
      JSON.stringify({ uuid: uuid, password: pw })
    );
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 text-white">
      <div className="bg-slate-800 rounded-lg p-5 flex flex-col gap-2">
        <p className="font-bold text-red-300">
          Are you sure you want to delete this password?
        </p>
        <div className="flex justify-end mr-1">
          <button
            className="w-max shadow-md hover:shadow-lg shadow-slate-700 rounded-xl stroke-red-300 hover:stroke-violet-400"
            onClick={(e) => {
              e.preventDefault();
              setDelPopup(false);
              handleDelete();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
