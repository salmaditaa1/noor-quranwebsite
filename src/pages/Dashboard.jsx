import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://equran.id/api/v2/surat")
      .then((res) => res.json())
      .then((result) => setData(result.data));
  }, []);

  const tambahFavorit = (surat) => {
    let favorit = JSON.parse(localStorage.getItem("favorit")) || [];

    const cek = favorit.find((item) => item.nomor === surat.nomor);

    if (!cek) {
      favorit.push(surat);
      localStorage.setItem("favorit", JSON.stringify(favorit));
      alert("Berhasil ditambahkan ke favorit ⭐");
    } else {
      alert("Sudah ada di favorit 😎");
    }
  };

  return (
    <div>
      <h2>📚 Daftar Surat</h2>

      {data.map((surat) => (
        <div
          key={surat.nomor}
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "10px"
          }}
        >
          <Link
            to={`/surat/${surat.nomor}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <h3>
              {surat.nomor}. {surat.namaLatin}
            </h3>
            <p>{surat.arti}</p>
          </Link>

          <button
            onClick={() => tambahFavorit(surat)}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              border: "none",
              borderRadius: "8px",
              background: "#facc15",
              cursor: "pointer"
            }}
          >
            ⭐ Favorit
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;