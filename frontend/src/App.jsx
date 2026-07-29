import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard";
import ProtectedRoute from "./routes/ProtectedRoute";import Home from "./pages/Home";

export default function App() {
  return <Home />;
}

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
  </Routes>
</BrowserRouter>