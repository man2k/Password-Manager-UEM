import { Link } from "react-router-dom";
import { extensions } from "@neutralinojs/lib";

const Home = () => {
  extensions.dispatch("index", "dataFunction", "").then((e) => {
    console.log(e);
  });

  return (
    <main className="bg-inherit min-h-screen min-w-full text-white">
      <div className="md:pt-40 p-20 flex justify-center">
        <h1 className="h-52 w-40 font-mono">
          <span className="text-indigo-300 text-3xl">
            <span className="text-sky-400 text-5xl">P</span>assword{" "}
            <span>
              <span className="text-sky-400 text-5xl">M</span>anager{" "}
              <span className="text-sky-400 text-5xl">UEM</span>
            </span>
          </span>{" "}
        </h1>
        <h2>
          <button className="mt-12 border-[1px] rounded-md p-2 ml-6">
            <Link to="/login">Get Started</Link>
          </button>
        </h2>
      </div>
    </main>
  );
};

export default Home;
