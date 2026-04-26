import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DetailSurat from "./pages/DetailSurat";
import Favorit from "./pages/Favorit";

function App() {
  return (
    <HashRouter>
      <div className="layout">
        <Navbar />

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/surat/:nomor" element={<DetailSurat />} />
            <Route path="/favorit" element={<Favorit />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;