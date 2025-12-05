import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const RootAdmin = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-5 bg-[#f0ede9] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
