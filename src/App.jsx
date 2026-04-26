import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DetailSurat from "./pages/DetailSurat";

function App() {
  return (
    <BrowserRouter basename="/alquranweb"> {/* 🔥 WAJIB */}
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
    </BrowserRouter>
  );
}

export default App;