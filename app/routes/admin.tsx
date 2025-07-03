// app/routes/_admin.tsx
import { Outlet } from "@remix-run/react";
import Sidebar from "~/components/Layout/Sidebar";
import ProtectedRoute from "~/lib/auth/ProtectedRoute";

export default function AdminLayout() {
  return (
    <ProtectedRoute>
      <div
        className="bg-red-500"
        style={{ display: "flex", minHeight: "100vh" }}
      >
        <Sidebar />
        <main style={{ flex: 1, padding: "1rem" }}>
          <Outlet /> {/* renders /admin/index, /admin/settings, etc */}
        </main>
      </div>
    </ProtectedRoute>
  );
}
