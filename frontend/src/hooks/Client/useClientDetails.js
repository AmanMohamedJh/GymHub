import { useState } from "react";

export const Client = () => {
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
    return { updateBMI, addWorkoutLog, addFitnessGoal, getFitnessData, isLoading, error };
};