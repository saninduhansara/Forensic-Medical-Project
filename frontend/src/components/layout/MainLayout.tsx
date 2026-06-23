import { Outlet, Navigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { useApp } from "@/context/AppContext";

export function MainLayout() {
  const { currentUser, setCurrentUser } = useApp();

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "var(--font-family-body)" }}>
      <Sidebar user={currentUser} onLogout={() => setCurrentUser(null)} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
