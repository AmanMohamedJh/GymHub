import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useProfile = () => {
  const { user, dispatch } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getProfile = async () => {
    if (!user) {
      setError("You must be logged in");
      return;
    }

    try {
      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        return null;
      }

      return json;
    } catch (error) {
      setError("Failed to fetch profile");
      return null;
    }
  };

  const updateProfile = async (formData) => {
    if (!user) {
      setError("You must be logged in");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        return null;
      }

      return json;
    } catch (error) {
      setError("Failed to update profile");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (updateData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending password update request:", updateData);
      const response = await fetch("/api/user/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      return data;
    } catch (error) {
      console.error("Password update error:", error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      // Logout user after successful deletion
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
      return json;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getProfile,
    updateProfile,
    updatePassword,
    deleteAccount,
    isLoading,
    error,
  };
};
