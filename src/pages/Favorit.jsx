function Favorit() {
  const favorit = JSON.parse(localStorage.getItem("favorit")) || [];

  return (
    <div>
      <h2>⭐ Surat Favorit</h2>

      {favorit.length === 0 ? (
        <p>Belum ada surat favorit</p>
      ) : (
        favorit.map((item) => (
          <div
            key={item.nomor}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px"
            }}
          >
            <h3>{item.namaLatin}</h3>
            <p>{item.arti}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Favorit;