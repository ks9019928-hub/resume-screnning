import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function Dashboard() {

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-10">

          <h1 className="text-4xl font-bold mb-4">
            Dashboard
          </h1>

          <p className="text-gray-600">
            Welcome to HireMind AI
          </p>

        </main>

      </div>

    </div>

  );

}

export default Dashboard;