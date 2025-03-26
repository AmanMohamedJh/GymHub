import { useState } from "react";

export const Client = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const addWorkoutLog = async (id, name, workoutData) => {
        setIsLoading(true);
        try {
            console.log(JSON.stringify("json data", { id, name, workoutData }));
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
                method: "POST",
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
                console.log(json);
                setError(null)
            }
        }
        catch (error) {
            console.error(error.message);
        }
    }
    return { updateBMI, addWorkoutLog, isLoading, error };
};