import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
      // Sync localStorage as backup/for components not in context yet
      localStorage.setItem("credits", res.data.credits.toString());
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateName = async (newName) => {
    try {
      const res = await api.put("/user/profile", { name: newName });
      setUser(prev => ({ ...prev, name: res.data.name }));
      return { success: true };
    } catch (err) {
      console.error("Failed to update name:", err);
      return { success: false, error: err.response?.data?.message || "Update failed" };
    }
  };

  const refreshCredits = () => {
    fetchProfile();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, updateName, refreshCredits, fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
