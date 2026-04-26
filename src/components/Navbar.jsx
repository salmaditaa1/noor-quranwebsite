import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [surat, setSurat] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch("https://equran.id/api/v2/surat")
      .then(res => res.json())
      .then(data => setSurat(data.data));
  }, []);

  return (
    <div className="sidebar">
      <h4 className="logo">📖 Qur'an Web</h4>

      <ul className="menu">
        {/* Dashboard */}
        <li>
          <Link 
            to="/" 
            className={location.pathname === "/" ? "active" : ""}
          >
            <i className="bi bi-house-door"></i> Dashboard
          </Link>
        </li>

        {/* Title */}
        <li className="menu-title">📂 Surat</li>

        {/* List Surat */}
        {surat.map((item) => (
          <li key={item.nomor}>
            <Link
              to={`/surat/${item.nomor}`}
              className={
                location.pathname === `/surat/${item.nomor}`
                  ? "active"
                  : ""
              }
            >
              {item.nomor}. {item.namaLatin}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Navbar;