import { HashRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DetailSurat from "./pages/DetailSurat";

function App() {
  const [open, setOpen] = useState(true);

  return (
    <HashRouter>
      <div className="app-layout">

        <Navbar open={open} setOpen={setOpen} />

        <div className={`main-content ${open ? "shift" : ""}`}>
          <button className="menu-btn" onClick={() => setOpen(!open)}>
            ☰
          </button>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/surat/:nomor"
              element={<DetailSurat setOpen={setOpen} />}
            />
          </Routes>
        </div>

      </div>
    </HashRouter>
  );
}

export default App;