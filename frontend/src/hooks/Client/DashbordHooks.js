import { useCallback } from "react";
import { useClientProfile } from "../../context/Client/clientProfileContex";
import { useAuthContext } from "../useAuthContext";

export const useDashboard = () => {
    const { profile } = useClientProfile();
    const { user } = useAuthContext();

    const isAuthenticated = () => {
        if (!user?._id || !user?.token) {
            throw new Error("User not authenticated");
        }
    };

    const fetchWithAuth = useCallback(
        async (url, options = {}) => {
            isAuthenticated();

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Request failed");
            }

            return data;
        },
        [user]
    );

    const fetchTotalBookings = useCallback(async () => {
        const clientId = profile?.profile?._id;
        if (!clientId) throw new Error("Profile ID not available");

        return await fetchWithAuth(`/api/gymBooking/count/${clientId}`);
    }, [profile, fetchWithAuth]);

    const fetchAllBookings = useCallback(async () => {
        const clientId = profile?.profile?._id;
        if (!clientId) throw new Error("Profile ID not available");

        return await fetchWithAuth(`/api/gymBooking/bookingDetails/${clientId}`);
    }, [profile, fetchWithAuth]);

    const cancelBooking = useCallback(
        async (bookingId) => {
            return await fetchWithAuth(`/api/gymBooking/cancel/${bookingId}`, {
                method: "PUT",
            });
        },
        [fetchWithAuth]
    );

    const deleteBooking = useCallback(
        async (bookingId) => {
            await fetchWithAuth(`/api/gymBooking/delete/${bookingId}`, {
                method: "DELETE",
            });
            await fetchAllBookings();
        },
        [fetchWithAuth, fetchAllBookings]
    );

    const getFitnessSummary = useCallback(() => {
        const fitness = profile?.profile?.fitness || {};
        const { fitnessGoals = [], workoutLogs = [] } = fitness;

        const totalGoals = fitnessGoals.length;
        const totalWorkouts = workoutLogs.length;
        const totalProgress = fitnessGoals.reduce(
            (sum, goal) => sum + (goal.progress || 0),
            0
        );
        const averageProgress = totalGoals > 0 ? +(totalProgress / totalGoals).toFixed(2) : 0;

        return { totalWorkouts, totalGoals, averageProgress };
    }, [profile]);

    const downloadCSVReport = useCallback(async () => {
        if (!user?._id) {
            alert("User not found. Please log in again.");
            return;
        }

        try {
            const response = await fetch(`/api/gymBooking/simple-csv/${user._id}`, {
                method: "GET",
                headers: {
                    Authorization: user.token ? `Bearer ${user.token}` : "",
                },
            });

            const contentType = response.headers.get("Content-Type");
            if (!response.ok) {
                let errorMsg = "Failed to download report";
                try {
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json();
                        errorMsg = errorData.error || errorMsg;
                    } else {
                        const text = await response.text();
                        errorMsg = text || errorMsg;
                    }
                } catch (e) { }
                throw new Error(errorMsg);
            }

            if (!contentType || !contentType.includes("text/csv")) {
                const text = await response.text();
                alert("Unexpected response format.\n" + text);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "simple_gymhub_report.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert(error.message || "An error occurred while downloading the report.");
        }
    }, [user]);

    const fetchJoinedGyms = useCallback(async () => {
        const clientId = user?._id;
        if (!clientId) throw new Error("User ID is required to fetch joined gyms");

        const gyms = await fetchWithAuth(`/api/users/${clientId}/ClientGymRegistrations`);
        return gyms || [];
    }, [user, fetchWithAuth]);

    const fetchUpcomingSessions = useCallback(async () => {
        const clientId = user?._id;
        if (!clientId) throw new Error("User ID is required to fetch upcoming sessions");

        const sessions = await fetchWithAuth(`/api/clientTrainerSessions/client/${clientId}/full`);
        return sessions || [];
    }, [user, fetchWithAuth]);

    const cancelTrainerSession = useCallback(
        async (bookingId) => {
            return await fetchWithAuth(`/api/clientTrainerSessions/cancel/${bookingId}`, {
                method: "PATCH",
            });
        },
        [fetchWithAuth]
    );

    const submitGymBooking = useCallback(
        async ({
            bookingModalGym,
            bookingForm,
            user,
            setBookingSubmitStatus,
            setIsModalOpen,
            setShowBookingSuccess,
            setBookingUpdated,
        }) => {
            setBookingSubmitStatus(null);
            if (!bookingModalGym) return;
            try {
                const res = await fetch(`/api/gymBooking/${bookingModalGym.gymId._id}/bookGym`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: user?.token ? `Bearer ${user.token}` : "",
                    },
                    body: JSON.stringify({ ...bookingForm, clientId: user?._id }),
                });
                const data = await res.json();
                if (res.ok) {
                    setBookingSubmitStatus("Booking successful!");
                    setIsModalOpen(false);
                    setShowBookingSuccess(true);
                    setBookingUpdated((prev) => !prev);
                } else {
                    setBookingSubmitStatus(data.error || "Booking failed.");
                }
            } catch {
                setBookingSubmitStatus("Network error. Please try again.");
            }
        },
        []
    );

    const fetchGymPublicDetails = useCallback(async (gymId) => {
        if (!gymId) throw new Error("Gym ID is required");

        const response = await fetch(`/api/gym/public/${gymId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch gym public details");
        }
        const data = await response.json();
        return data;
    }, []);

    return {
        fetchTotalBookings,
        fetchAllBookings,
        cancelBooking,
        deleteBooking,
        getFitnessSummary,
        downloadCSVReport,
        fetchJoinedGyms,
        fetchUpcomingSessions,
        cancelTrainerSession,
        submitGymBooking,
        fetchGymPublicDetails,
    };
};
