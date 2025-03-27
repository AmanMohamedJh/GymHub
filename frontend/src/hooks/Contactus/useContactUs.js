import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useSendContact = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { user } = useAuthContext();

    const sendContact = async (name, email, subject, message) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:4000/api/contactUs/contactUsAdd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: user ? user._id : null,
                    name, 
                    email, 
                    subject: subject || "No Subject", 
                    message 
                }),
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.message || "Failed to send message");
                setIsLoading(false);
                return false;
            }
            
            setIsLoading(false);
            return true;
        } catch (err) {
            setError("Failed to send message. Please try again.");
            setIsLoading(false);
            return false;
        }
    };

    return { sendContact, isLoading, error };
};