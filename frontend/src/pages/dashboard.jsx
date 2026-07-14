import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import UploadForm from "../components/upload/UploadForm";

function Dashboard() {

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-10">

          <h1 className="text-4xl font-bold mb-8">
  Dashboard
</h1>

<UploadForm />

        </main>

      </div>

    </div>

  );

}

export default Dashboard;