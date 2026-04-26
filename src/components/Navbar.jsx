import { Link } from "react-router-dom";

function Navbar({ open, setOpen }) {
  return (
    <div className={`sidebar ${open ? "show" : "hide"}`}>
      <h3 className="logo">📖 Qur'an App</h3>

      <ul className="menu">
        <li>
          <Link to="/" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;