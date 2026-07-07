import { useState, useEffect } from "react";
import { Compass, MapPin, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import useGeolocation from "../hooks/useGeolocation";
import Loader from "../components/Common/Loader";

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

function QiblaPage() {
  const { coordinates, loading: geoLoading, error: geoError } = useGeolocation();
  const [heading, setHeading] = useState(0);
  const [qiblaBearing, setQiblaBearing] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Calculate Qibla Bearing
  useEffect(() => {
    if (coordinates) {
      const lat1 = coordinates.latitude * (Math.PI / 180);
      const lng1 = coordinates.longitude * (Math.PI / 180);
      const lat2 = KAABA_LAT * (Math.PI / 180);
      const lng2 = KAABA_LNG * (Math.PI / 180);

      const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);

      let bearing = Math.atan2(y, x) * (180 / Math.PI);
      bearing = (bearing + 360) % 360; // Normalize to 0-360
      setQiblaBearing(bearing);
    }
  }, [coordinates]);

  // Request Compass Permission (For iOS 13+)
  const requestCompassPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === "granted") {
          setPermissionGranted(true);
        } else {
          setIsSupported(false);
        }
      } catch (error) {
        console.error(error);
        setIsSupported(false);
      }
    } else {
      setPermissionGranted(true); // Non-iOS or older devices
    }
  };

  // Listen to Device Orientation
  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (e) => {
      let compassHeading = e.webkitCompassHeading;
      if (compassHeading === undefined || compassHeading === null) {
        // Fallback for non-iOS devices using absolute orientation
        if (e.absolute === true || e.type === "deviceorientationabsolute") {
          compassHeading = 360 - e.alpha;
        } else if (e.alpha !== null) {
          compassHeading = 360 - e.alpha; // approximate if absolute not guaranteed
        }
      }
      if (compassHeading !== undefined && compassHeading !== null) {
        setHeading(compassHeading);
      } else {
        setIsSupported(false);
      }
    };

    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    } else {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      if ("ondeviceorientationabsolute" in window) {
        window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      } else {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
    };
  }, [permissionGranted]);

  if (geoLoading) return <Loader label="Mendapatkan Lokasi..." />;

  if (geoError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-noor-dark">Lokasi Tidak Ditemukan</h2>
        <p className="text-sm text-noor-textSecondary mt-2">
          Pastikan Anda mengizinkan akses lokasi pada browser untuk menggunakan fitur Kiblat.
        </p>
      </div>
    );
  }

  // Calculate the rotation of the Kaaba pointer
  // The compass dial rotates opposite to the phone's heading, so North is always "up" on the screen relative to the real world.
  // The Kaaba pointer points at (Qibla Bearing - Heading) degrees relative to the top of the screen.
  const compassRotation = -heading; 
  const kaabaPointerRotation = qiblaBearing - heading;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8 flex flex-col min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/prayer" className="p-2 rounded-xl bg-white border border-noor-divider shadow-sm hover:bg-noor-gold/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-noor-dark" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-noor-dark flex items-center gap-2">
            <Compass className="w-6 h-6 text-noor-gold" />
            Kompas Kiblat
          </h2>
          <p className="text-sm text-noor-textSecondary font-medium">Arahkan perangkat Anda untuk menemukan Kiblat</p>
        </div>
      </div>

      {!permissionGranted && isSupported && (
        <div className="bg-white border border-noor-divider rounded-xl p-6 text-center shadow-noor-warm mb-8">
          <p className="text-sm text-noor-dark font-medium mb-4">
            Untuk menggunakan kompas interaktif, kami membutuhkan akses ke sensor orientasi perangkat Anda.
          </p>
          <button
            onClick={requestCompassPermission}
            className="px-6 py-3 bg-noor-gold text-white rounded-xl font-bold shadow-md hover:bg-noor-dark transition-colors"
          >
            Aktifkan Sensor Kompas
          </button>
        </div>
      )}

      {(!isSupported) && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-8 text-sm text-center">
          Sensor kompas tidak didukung di perangkat atau browser ini. Namun Anda masih dapat melihat derajat arah kiblat di bawah.
        </div>
      )}

      {/* Compass Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-noor-gold/30 bg-noor-card shadow-noor-heavy flex items-center justify-center">
          
          {/* Compass Dial */}
          <div 
            className="absolute inset-0 rounded-full transition-transform duration-200 ease-out flex items-center justify-center"
            style={{ transform: `rotate(${compassRotation}deg)` }}
          >
            {/* Compass Markings (N, E, S, W) */}
            <div className="absolute top-4 font-bold text-noor-dark text-lg">U</div>
            <div className="absolute right-4 font-bold text-noor-textSecondary text-lg">T</div>
            <div className="absolute bottom-4 font-bold text-noor-textSecondary text-lg">S</div>
            <div className="absolute left-4 font-bold text-noor-textSecondary text-lg">B</div>

            {/* Tick Marks */}
            {Array.from({ length: 36 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-[2px] h-3 bg-noor-divider"
                style={{
                  transform: `rotate(${i * 10}deg) translateY(-135px)`
                }}
              />
            ))}
          </div>

          {/* Kaaba Pointer */}
          <div 
            className="absolute inset-0 rounded-full transition-transform duration-200 ease-out z-10 flex items-center justify-center"
            style={{ transform: `rotate(${kaabaPointerRotation}deg)` }}
          >
            <div className="absolute top-2 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-noor-gold" />
              <div className="w-6 h-6 bg-noor-dark text-white rounded-md flex items-center justify-center mt-2 shadow-md">
                <span className="text-[10px] font-bold text-noor-gold">🕋</span>
              </div>
            </div>
          </div>
          
          {/* Center Dot */}
          <div className="w-4 h-4 bg-noor-gold rounded-full shadow-md z-20 border-2 border-white" />
        </div>

        {/* Readings */}
        <div className="mt-12 bg-white border border-noor-divider/50 p-6 rounded-xl shadow-noor-sm w-full max-w-sm text-center">
          <div className="grid grid-cols-2 gap-4 divide-x divide-noor-divider/50">
            <div>
              <span className="text-[10px] text-noor-textSecondary uppercase font-bold tracking-wider block mb-1">Arah Anda</span>
              <span className="text-2xl font-mono font-bold text-noor-dark">{Math.round(heading)}°</span>
            </div>
            <div>
              <span className="text-[10px] text-noor-gold uppercase font-bold tracking-wider block mb-1">Kiblat</span>
              <span className="text-2xl font-mono font-bold text-noor-light">{Math.round(qiblaBearing)}°</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default QiblaPage;
