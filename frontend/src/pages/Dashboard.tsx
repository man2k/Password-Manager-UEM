import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { extensions, events } from "@neutralinojs/lib";
import UserTableData from "../components/UserTableData";

type userDataFormat = {
  id: number;
  website: string;
  username: string;
  email: string;
  password: string;
  notes: string;
};

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    website: "",
    username: "",
    email: "",
    password: "",
    notes: "",
  });
  const [userData, setUserData] = useState<userDataFormat[]>([]);
  const [pcount, setPcount] = useState<number>(0);
  const { uuid } = useContext(AuthContext);
  // console.log(uuid);
  // extensions.getStats().then((e) => {
  //   console.log(e);
  // });

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
    // .then((e) => {
    //   // console.log(e);
    // });

    // return () => {
    // second;
    // };
  }, ["userData"]);

  const addNewPassword = () => {
    extensions.dispatch(
      "password.manager.uem.nodeServer",
      "newPassword",
      JSON.stringify({
        uuid: uuid,
        website: formData.website,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        notes: formData.notes,
      })
    );
    // .catch((err) => {
    //   console.log("Extension isn't loaded!");
    // });
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
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    addNewPassword();
    clearForm();
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
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 text-white">
                <div className="bg-slate-800 rounded-lg p-5">
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="website"
                        className="block text-sm font-medium"
                      >
                        Website
                      </label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-violet-200 text-black px-2"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-violet-200 text-black px-2"
                      />
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-violet-200 text-black px-2"
                      />
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium"
                      >
                        Notes
                      </label>
                      <input
                        type="text"
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-violet-200 text-black px-2"
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
            <div className="border-2 border-dashed border-indigo-400  rounded-lg h-96">
              {/* Password List */}
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
