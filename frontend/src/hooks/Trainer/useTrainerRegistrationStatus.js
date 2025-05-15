import { useState, useEffect } from "react";

/**
 * Custom hook to check if the current user is registered as a trainer.
 * Returns:
 *   - true: user is registered as a trainer
 *   - false: user is not registered
 *   - null: loading or not checked
 */
export default function useTrainerRegistrationStatus(user) {
  const [isRegistered, setIsRegistered] = useState(null);

  useEffect(() => {
    if (!user) {
      setIsRegistered(null);
      return;
    }
    const checkRegistration = async () => {
      try {
        const res = await fetch("/api/trainer/registration/me", {
          headers: { Authorization: user.token ? `Bearer ${user.token}` : "" },
        });
        setIsRegistered(res.ok);
      } catch (err) {
        setIsRegistered(false);
      }
    };
    checkRegistration();
  }, [user]);

  return isRegistered;
}
