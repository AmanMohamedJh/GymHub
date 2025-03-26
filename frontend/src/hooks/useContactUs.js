import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSendContact = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { user, dispatch } = useAuthContext();

    const sendContact = async (name, email, subject, message) => {

        setIsLoading(true);
        const userId = user ? user._id : null;

        const response = await fetch("/api/contactUs/contactUsAdd", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, name, email, subject, message }),
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setIsLoading(false);
            return false;
        } else {
            setIsLoading(false);
            console.log("contact submitted");
            return true;
        }

    };

    return { sendContact, isLoading, error }

}