import "./App.css";
import {
  Navbar,
  Welcome,
  Footer,
  Loader,
  Services,
  Transaction,
} from "./components";

import React from "react";

const App = () => {
  return (
    <>
      {/* 这两个className有什么作用？一个是tailwindcss里的 一个是自定义的 */}
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <Navbar />
          <Welcome />
        </div>
        <Services />
        <Transaction />
        <Footer />
      </div>
      <div>welcome</div>
    </>
  );
};

export default App;
