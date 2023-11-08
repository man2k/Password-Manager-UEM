const Dashboard = () => {
  return (
    <div className="min-h-screen p-4">
      <header className="shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-indigo-400">
            Password Manager Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace this with your actual dashboard UI */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-2 border-dashed border-indigo-400 p-2 pt-0 rounded-lg h-96">
              {/* Password List */}
              <div className="overflow-auto h-full">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left font-medium text-white uppercase tracking-wider py-3 px-6">
                        Website
                      </th>
                      <th className="text-left font-medium text-white uppercase tracking-wider py-3 px-6">
                        Username
                      </th>
                      <th className="text-left font-medium text-white uppercase tracking-wider py-3 px-6">
                        Password
                      </th>
                      <th className="text-left font-medium text-white uppercase tracking-wider py-3 px-6">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-indigo-300">
                    <tr className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap">
                        example.com
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        user@example.com
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">********</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  </tbody>
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
