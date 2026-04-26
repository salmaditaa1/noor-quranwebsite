import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DetailSurat from "./pages/DetailSurat";

function App() {
  return (
    <HashRouter>
      <div className="app-layout">
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/surat/:nomor" element={<DetailSurat />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;