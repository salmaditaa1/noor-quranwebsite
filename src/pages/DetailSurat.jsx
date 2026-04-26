import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function DetailSurat() {
  const { nomor } = useParams();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${nomor}`)
      .then(res => res.json())
      .then(data => setDetail(data.data));
  }, [nomor]);

  if (!detail) return <p>Loading...</p>;

  return (
    <div>
      {/* HEADER */}
      <h2>{detail.namaLatin}</h2>
      <p className="text-muted">{detail.arti}</p>
      <p>{detail.jumlahAyat} ayat • {detail.tempatTurun}</p>

      {/* DESKRIPSI */}
      <div
        className="mb-4"
        dangerouslySetInnerHTML={{ __html: detail.deskripsi }}
      ></div>

      <hr />

      {/* AYAT */}
      {detail.ayat.map((ayat) => (
        <div key={ayat.nomorAyat} className="mb-4">
          
          <h5>{ayat.nomorAyat}</h5>

          {/* 🔥 PAKAI FONT ARAB */}
          <p className="arabic-text">
            {ayat.teksArab}
          </p>

          <p><i>{ayat.teksLatin}</i></p>
          <p>{ayat.teksIndonesia}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default DetailSurat;