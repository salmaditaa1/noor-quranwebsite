import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DetailSurat from "./pages/DetailSurat";

function App() {
  return (
    <HashRouter>
      <div>
        <Navbar />

        <div
          style={{
            marginLeft: "260px",
            padding: "20px",
            backgroundColor: "#f4f6f9",
            minHeight: "100vh"
          }}
        >
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