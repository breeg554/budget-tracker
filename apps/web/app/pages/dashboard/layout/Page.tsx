import { Outlet } from "@remix-run/react";
import { DashboardNav } from "~/dashboard/layout/components/DashboardNav";

export const DashboardLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100">
        <DashboardNav />
      </div>
    </>
  );
};
