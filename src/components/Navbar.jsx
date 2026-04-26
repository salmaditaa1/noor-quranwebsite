import { Link } from "react-router-dom";

function Navbar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h2>📖 Qur'an App</h2>
        <p>Baca Al-Qur'an Digital</p>
      </div>

      <ul className="menu">
        <li>
          <Link to="/">🏠 Dashboard</Link>
        </li>

        <li>
          <Link to="/">📚 Daftar Surat</Link>
        </li>

        <li>
          <Link to="/favorit">⭐ Favorit</Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        <small>✨ Semoga bermanfaat</small>
      </div>
    </aside>
  );
}

export default Navbar;