import { useState } from "react";

export const GymlistClient = () => {
    const [isLoading, setIsLoading] = useSatte(null);
    const [error, setError] = useState(null);

    const getAllGyms = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("api/gym/getAllgym", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const json = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setError(null);
                return json;
            }

        } catch (error) {
            console.error("error fetching Gym List", error);
        }
    }
    return { getAllGyms, isLoading, error };
}