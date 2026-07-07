import { useEffect, useRef, useState } from "react";
import { useAppSettings } from "../../context/AppSettingsContext";
import toast from "react-hot-toast";

const AZAN_URLS = {
  makkah: "https://server11.mp3quran.net/makkah/Adhan_Al_Haram_Al_Makki_1.mp3",
  madinah: "https://server11.mp3quran.net/makkah/Adhan_Al_Haram_Al_Makki_1.mp3", // placeholder
  "al-aqsa": "https://server11.mp3quran.net/makkah/Adhan_Al_Haram_Al_Makki_1.mp3", // placeholder
  indonesia: "https://server11.mp3quran.net/makkah/Adhan_Al_Haram_Al_Makki_1.mp3", // placeholder
  beep: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
};

export default function AzanReminder() {
  const { todayPrayerTimes } = useAppSettings();
  const audioRef = useRef(null);
  const [triggeredPrayers, setTriggeredPrayers] = useState(new Set());

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  useEffect(() => {
    if (!todayPrayerTimes) return;

    const interval = setInterval(() => {
      const settings = JSON.parse(localStorage.getItem("noor_azan_settings")) || {
        globalMute: false, volume: 80, sound: "makkah", preAlarmMins: 0,
        prayers: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true }
      };

      if (settings.globalMute) return;

      const now = new Date();
      const currentH = String(now.getHours()).padStart(2, "0");
      const currentM = String(now.getMinutes()).padStart(2, "0");
      const currentHM = `${currentH}:${currentM}`;

      // Check each prayer time
      Object.entries(todayPrayerTimes).forEach(([prayer, timeStr]) => {
        if (!timeStr) return;
        
        // Ensure we don't trigger the same prayer twice in one day
        if (triggeredPrayers.has(prayer)) return;

        // Apply pre-alarm minutes if needed. TimeStr is HH:MM
        const [ph, pm] = timeStr.split(":").map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(ph, pm, 0, 0);
        prayerDate.setMinutes(prayerDate.getMinutes() - (settings.preAlarmMins || 0));
        
        const triggerH = String(prayerDate.getHours()).padStart(2, "0");
        const triggerM = String(prayerDate.getMinutes()).padStart(2, "0");
        const triggerHM = `${triggerH}:${triggerM}`;

        if (currentHM === triggerHM && settings.prayers[prayer]) {
          // Time to trigger
          setTriggeredPrayers(prev => new Set([...prev, prayer]));
          
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`Waktu Sholat ${prayer}`, {
              body: `Telah masuk waktu sholat ${prayer} (${timeStr})`,
              icon: "/vite.svg"
            });
          }

          toast(`Waktu Sholat ${prayer} (${timeStr})`, { icon: '🕌' });

          if (audioRef.current) {
            audioRef.current.src = AZAN_URLS[settings.sound] || AZAN_URLS.makkah;
            audioRef.current.volume = settings.volume / 100;
            audioRef.current.play().catch(e => console.error("Audio autoplay blocked", e));
          }
        }
      });
    }, 1000 * 30); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [todayPrayerTimes, triggeredPrayers]);

  // Daily reset
  useEffect(() => {
    const today = new Date().getDate();
    const storedDay = localStorage.getItem("noor_azan_day");
    if (storedDay !== String(today)) {
      setTriggeredPrayers(new Set());
      localStorage.setItem("noor_azan_day", today);
    }
  }, []);

  return null; // This is a background component
}
