import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { extensions, events } from "@neutralinojs/lib";
import UserTableData from "../components/UserTableData";
import NewPasswordForm from "../components/NewPasswordForm";

type userDataFormat = {
  id: number;
  website: string;
  username: string;
  email: string;
  password: string;
  notes: string;
};

const Dashboard = () => {
  const { uuid } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [userData, setUserData] = useState<userDataFormat[]>([]);
  const [pcount, setPcount] = useState<number>(0);

  useEffect(() => {
    events.on("readPrivReply", (evt) => {
      const dat = JSON.parse(evt.detail);
      setUserData(dat);
      setPcount(dat.length);
    });

    extensions.dispatch(
      "password.manager.uem.nodeServer",
      "readPrivData",
      JSON.stringify({ uuid: uuid })
    );

    // return () => {
    // second;
    // };
  }, ["userData"]);

  return (
    <div className="min-h-screen p-4">
      <header className="shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-indigo-400">
            Password Manager Dashboard
          </h1>
        </div>
      </header>
      <main className="flex flex-col">
        <div className="flex flex-row justify-between w-full">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <button
              className="text-indigo-300 border-[1px] border-indigo-400 rounded-md mt-2 p-1 bg-stone-900 hover:bg-indigo-400 hover:text-black"
              onClick={() => setShowPopup(true)}
            >
              Add New Password
            </button>
            {showPopup && (
              <NewPasswordForm uuid={uuid} setShowPopup={setShowPopup} />
            )}
          </div>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <button className="border-[1px] border-indigo-400 rounded-md mt-2 p-1 bg-indigo-400 text-black">
              Total Saved Passwords: {pcount}
            </button>
          </div>
        </div>
        <div className="py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-2 border-dashed border-indigo-400 bg-slate-800 rounded-lg h-96">
              <div className="overflow-auto h-full">
                <table className="min-w-full rounded-lg bg-indigo-900">
                  <thead className="border-b ">
                    <tr>
                      <th
                        key="website"
                        className="text-left font-medium text-indigo-300 uppercase tracking-wider py-3 px-6"
                      >
                        Website
                      </th>
                      <th
                        key="username"
                        className="text-left font-medium text-indigo-300 uppercase tracking-wider py-3 px-6"
                      >
                        Username
                      </th>
                      <th
                        key="password"
                        className="text-left font-medium text-indigo-300 uppercase tracking-wider py-3 px-6"
                      >
                        Password
                      </th>
                      <th
                        key="notes"
                        className="text-left font-medium text-indigo-300 uppercase tracking-wider py-3 px-6"
                      >
                        Notes
                      </th>
                    </tr>
                  </thead>
                  {userData.map((udata) => (
                    <UserTableData udata={udata} key={udata.id} />
                  ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
