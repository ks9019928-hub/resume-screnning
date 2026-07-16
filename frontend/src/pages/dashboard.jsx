import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import UploadForm from "../components/upload/UploadForm";
import { useState } from "react";

function Dashboard() {
    const [result, setResult] = useState(null);

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-10">

          <h1 className="text-4xl font-bold mb-8">
  Dashboard
</h1>

{/* Upload Component */}

          <UploadForm setResult={setResult} />

          {/* Later we'll replace this JSON with cards */}

          {result && (

            <pre className="mt-8 bg-black text-green-400 p-6 rounded-xl overflow-auto">

              {JSON.stringify(result, null, 2)}

            </pre>

          )}

        </main>

      </div>

    </div>

  );

}
export default Dashboard;