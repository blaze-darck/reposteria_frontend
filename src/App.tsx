import React from "react";
import Navbar from "./comun/navbar";
import Sidebar from "./comun/sidebar";

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
      </div>
    </div>
  );
}

export default App;
