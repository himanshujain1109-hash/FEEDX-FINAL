import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Browse from "./pages/Browse";
import FoodDetails from "./pages/FoodDetails";
import DonorDashboard from "./pages/DonorDashboard";
import AddFood from "./pages/AddFood";
import ReceiverDashboard from "./pages/ReceiverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/food/:id" element={<FoodDetails />} />

          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/add-food"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <AddFood />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver"
            element={
              <ProtectedRoute allowedRoles={["receiver"]}>
                <ReceiverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
