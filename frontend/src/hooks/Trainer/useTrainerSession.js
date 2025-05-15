import { useState, useEffect } from "react";

const API_URL = "http://localhost:4070/api/trainer-session";

const useTrainerSession = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then(setSessions)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const addNewSession = async (sessionData) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionData),
    });
    const newSession = await response.json();
    setSessions((prev) => [...prev, newSession]);
  };

  const removeSession = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setSessions((prev) => prev.filter((session) => session._id !== id));
  };

  return { sessions, loading, error, addNewSession, removeSession };
};

export default useTrainerSession;
