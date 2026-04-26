import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [surat, setSurat] = useState([]);

  useEffect(() => {
    fetch("https://equran.id/api/v2/surat")
      .then(res => res.json())
      .then(data => setSurat(data.data));
  }, []);

  return (
    <div>
      <h3 className="mb-4">📚 Daftar Surat</h3>

      <div className="row">
        {surat.map(item => (
          <div className="col-md-4 mb-3" key={item.nomor}>
            <Link to={`/surat/${item.nomor}`} style={{ textDecoration: "none" }}>
              
              <div className="card shadow-sm card-hover">
                <div className="card-body">
                  <h5>{item.namaLatin}</h5>
                  <p className="mb-1">{item.arti}</p>
                  <small className="text-muted">
                    {item.jumlahAyat} ayat • {item.tempatTurun}
                  </small>
                </div>
              </div>

            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;