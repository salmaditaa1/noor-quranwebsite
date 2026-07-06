import { useState, useEffect } from "react";

function useGeolocation() {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setCoordinates({ latitude: -6.200000, longitude: 106.816666 }); // Jakarta fallback
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
      },
      (err) => {
        console.warn("Geolocation access denied or failed. Falling back to Jakarta.", err.message);
        setError(err.message);
        setCoordinates({ latitude: -6.200000, longitude: 106.816666 }); // Jakarta fallback
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { coordinates, error, loading };
}

export default useGeolocation;
