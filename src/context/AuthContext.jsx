import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("noor-user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fall through
      }
    }
    return {
      id: "guest",
      name: "",
      email: "",
      city: "",
      photo: null,
      isGuest: true
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("noor-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("noor-user");
    }
  }, [user]);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("noor-users-db")) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      // Don't save password in session
      const sessionUser = { ...foundUser };
      delete sessionUser.password;
      setUser(sessionUser);
      toast.success("Berhasil masuk!");
      return true;
    }
    toast.error("Email atau password salah.");
    return false;
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem("noor-users-db")) || [];
    if (users.find(u => u.email === email)) {
      toast.error("Email sudah terdaftar!");
      return false;
    }
    const newUser = { id: Date.now(), name, email, password, city: "Jakarta", photo: null };
    users.push(newUser);
    localStorage.setItem("noor-users-db", JSON.stringify(users));
    
    // Auto login
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    setUser(sessionUser);
    toast.success("Akun berhasil dibuat!");
    return true;
  };

  const logout = () => {
    setUser({
      id: "guest",
      name: "",
      email: "",
      city: "",
      photo: null,
      isGuest: true
    });
    toast.success("Berhasil keluar akun. Menggunakan profil lokal.");
  };

  const updateProfile = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      if (!prev.isGuest) {
        // Also update in mock DB
        const users = JSON.parse(localStorage.getItem("noor-users-db")) || [];
        const idx = users.findIndex(u => u.id === updated.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...updates };
          localStorage.setItem("noor-users-db", JSON.stringify(users));
        }
      }
      return updated;
    });
    toast.success("Profil berhasil diperbarui!");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
