import { useContext } from "react";
import { GymContext } from "../../context/Gym_Owner/GymContext";
import { useAuthContext } from "../useAuthContext";

export const useGym = () => {
  const { dispatch } = useContext(GymContext);
  const { user } = useAuthContext();

  const registerGym = async (formData) => {
    try {
      const response = await fetch("http://localhost:4000/api/gym/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData, // FormData object with files
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      dispatch({ type: "ADD_GYM", payload: json });
      return json;
    } catch (error) {
      throw error;
    }
  };

  const getOwnerGyms = async (status = null) => {
    try {
      const url = status
        ? `http://localhost:4000/api/gym/owner-gyms?status=${status}`
        : "http://localhost:4000/api/gym/owner-gyms";
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      dispatch({ type: "SET_GYMS", payload: json });
      return json;
    } catch (error) {
      throw error;
    }
  };

  const updateGym = async (gymId, formData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/gym/${gymId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      dispatch({ type: "UPDATE_GYM", payload: json });
      return json;
    } catch (error) {
      throw error;
    }
  };

  const deleteGym = async (gymId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/gym/${gymId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      dispatch({ type: "DELETE_GYM", payload: gymId });
      return json;
    } catch (error) {
      throw error;
    }
  };

  const getNearbyGyms = async (lat, lng, radius) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/gym/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      return json;
    } catch (error) {
      throw error;
    }
  };

  const getPendingGyms = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/gym/pending", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      return json;
    } catch (error) {
      throw error;
    }
  };

  const updateGymStatus = async (gymId, status) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/gym/${gymId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      dispatch({ type: "UPDATE_GYM_STATUS", payload: { gymId, status } });
      return json;
    } catch (error) {
      throw error;
    }
  };

  return {
    registerGym,
    getOwnerGyms,
    updateGym,
    deleteGym,
    getNearbyGyms,
    getPendingGyms,
    updateGymStatus,
  };
};
