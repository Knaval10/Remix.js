import { Outlet } from "@remix-run/react";
import Sidebar from "~/components/Layout/Sidebar";
import ProtectedRoute from "~/lib/auth/ProtectedRoute";

export default function AdminLayout() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-100vh">
        <Sidebar />
        <main className="flex-1 p-10">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}
