import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const Client = () => {

    // Registration function
    const { user } = useAuthContext();
    const registerClient = async (payload) => {
        console.log("registerClient called with payload:", payload);
        setIsLoading(true);
        setError(null);
        if (!user || !user.token) {
            setError('User authentication token missing. Please log in again.');
            setIsLoading(false);
            return false;
        }
        let response, json;
        console.log('[registerClient] Before fetch');
        try {
            response = await fetch("/api/client/registerClient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(payload),
            });
            console.log('[registerClient] After fetch, before json');
        } catch (fetchErr) {
            console.error('Fetch error:', fetchErr);
            setError('Network error: ' + fetchErr.message);
            setIsLoading(false);
            return false;
        }
        try {
            json = await response.json();
        } catch (jsonErr) {
            console.error('Failed to parse JSON:', jsonErr);
            setError('Server error (invalid JSON)');
            setIsLoading(false);
            return false;
        }
        console.log('Registration response:', response.status, json);
        if (!response.ok) {
            setError(json.error);
            setIsLoading(false);
            return false;
        } else {
            setIsLoading(false);
            return true;
        }
    };

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const addWorkoutLog = async (id, name, workoutData) => {
        setIsLoading(true);
        try {
            const response = await fetch("api/client/addWorkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, name, workoutData }),
            });

            const json = await response.json();
console.log('Registration response:', response.status, json);

            if (!response.ok) {
                setError(json.error);
                setIsLoading(false);
                return false;
            } else {
                setIsLoading(false);
                console.log(json);
                return true;
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const updateBMI = async (id, formData) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("from fetch start:", { id, formData });
            const response = await fetch("api/client/updateBMI", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, formData }),
            });

            const json = await response.json();
console.log('Registration response:', response.status, json);

            if (!response.ok) {
                setError(json.error);
                setIsLoading(false);
                return false;
            } else {
                setIsLoading(false);
                setError(null);
                return true;
            }
        }
        catch (error) {
            console.error(error.message);
        }
    }
    const addFitnessGoal = async (id, formData) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("from fetch start:", { id, formData });
            const response = await fetch("api/client/updateGoal", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, formData }),
            });

            const json = await response.json();
console.log('Registration response:', response.status, json);

            if (!response.ok) {
                setError(json.error);
                setIsLoading(false);
                return false;
            } else {
                setIsLoading(false);
                setError(null);
                console.log("gooood")
                return true;
            }
        }
        catch (error) {
            console.error(error.message);
        }
    }

    const getFitnessData = async (id) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch(`/api/client/getFitnessData/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const json = await response.json();
console.log('Registration response:', response.status, json);

            if (!response.ok) {
                setError(json.error);
                setIsLoading(false);
                return false;
            } else {
                setIsLoading(false);
                console.log(json);
                setError(null);
                return json;
            }
        } catch (error) {
            console.error("Error fetching BMI history:", error);
        }
    }
    return { updateBMI, addWorkoutLog, addFitnessGoal, getFitnessData, registerClient, isLoading, error };
};