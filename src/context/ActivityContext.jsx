import { createContext, useContext, useState, useEffect } from "react";

const ActivityContext = createContext();

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState(() => {
    return JSON.parse(localStorage.getItem("noor-activities")) || [];
  });

  useEffect(() => {
    localStorage.setItem("noor-activities", JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      timestamp: Date.now(),
    };

    setActivities((prev) => {

      // Keep only the latest 50 activities to avoid localstorage bloat
      const updated = [newActivity, ...prev];
      return updated.slice(0, 50);
    });
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
}
