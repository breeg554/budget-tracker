import { Outlet } from "@remix-run/react";

export const DashboardLayout = () => {
  return (
    <main className="min-h-screen overflow-y-auto">
      <Outlet />
    </main>
  );
};
