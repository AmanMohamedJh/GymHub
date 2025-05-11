import { useState, useCallback } from "react";
import { useClientProfile } from "../../context/Client/clientProfileContex";
import { useAuthContext } from "../useAuthContext";

export const useDashboard = () => {
    const { profile } = useClientProfile();
    const { user } = useAuthContext();

    // Fetch total bookings
    const fetchTotalBookings = useCallback(async () => {
        if (!user?._id || !user?.token || !profile?.profile?._id) {
    // Return mock data if not authenticated or profile not loaded
    return 0;
    }
        try {
            const res = await fetch(`/api/gym-booking/count/${profile.profile._id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch total bookings");
            }

            const data = await res.json();
            return data.totalBookings || 0;
        } catch (err) {
            throw new Error(err.message || "An error occurred while fetching total bookings");
        }
    }, [user, profile]);

    // Fetch upcoming bookings (future + status Pending or Confirmed)
    const fetchUpcomingBookings = useCallback(async () => {
        if (!user?._id || !user?.token || !profile?.profile?._id) {
    // Return mock data if not authenticated or profile not loaded
    return 0;
}
        try {
            const res = await fetch(`/api/gym-booking/bookingDetails/${profile.profile._id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch bookings");
            }
            const data = await res.json();
            const now = new Date();
            // Only future bookings with Pending/Confirmed status
            const upcoming = data.filter(b => new Date(b.bookingTime) > now && (b.status === 'Pending' || b.status === 'Confirmed'));
            return upcoming.length;
        } catch (err) {
            throw new Error(err.message || "An error occurred while fetching upcoming bookings");
        }
    }, [user, profile]);

    // Fetch upcoming classes (future bookings with type === 'Class')
    const fetchUpcomingClasses = useCallback(async () => {
        if (!user?._id || !user?.token || !profile?.profile?._id) {
    // Return mock data if not authenticated or profile not loaded
    return 0;
}
        try {
            const res = await fetch(`/api/gym-booking/bookingDetails/${profile.profile._id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch bookings");
            }
            const data = await res.json();
            const now = new Date();
            // Only future bookings with type 'Class'
            const upcomingClasses = data.filter(b => new Date(b.bookingTime) > now && b.type === 'Class');
            return upcomingClasses.length;
        } catch (err) {
            throw new Error(err.message || "An error occurred while fetching upcoming classes");
        }
    }, [user, profile]);

    // Progress Score (from fitness summary)
    const getProgressScore = useCallback(() => {
        if (!profile?.profile) return 0;
        const fitness = profile.profile.fitness || {};
        const goals = fitness.fitnessGoals || [];
        const totalGoals = goals.length;
        const totalProgress = goals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
        const averageProgress = totalGoals > 0 ? Number((totalProgress / totalGoals).toFixed(2)) : 0;
        return averageProgress;
    }, [profile]);

    // Total gyms joined
    const getTotalGymsJoined = useCallback(() => {
        if (!profile?.profile) return 0;
        // Assuming profile.profile.joinedGyms is an array of gym IDs or objects
        const gyms = profile.profile.joinedGyms || [];
        return gyms.length;
    }, [profile]);

    return {
        fetchTotalBookings,
        fetchUpcomingBookings,
        fetchUpcomingClasses,
        getProgressScore,
        getTotalGymsJoined
    };


    const fetchAllBookings = useCallback(async () => {
        if (!user?._id || !user?.token || !profile?.profile?._id) {
    // Return mock data if not authenticated or profile not loaded
    return 0;
}
        try {
            const response = await fetch(`/api/gym-booking/bookingDetails/${profile.profile._id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch bookings');
            }

            const data = await response.json();
            return data; // Returns all booking details
        } catch (err) {
            throw new Error(err.message || 'An error occurred while fetching bookings');
        }
    }, [user, profile]);

    const cancelBooking = useCallback(async (bookingId) => {
        if (!user?._id || !user?.token || !profile?.profile?._id) {
    // Return mock data if not authenticated or profile not loaded
    return 0;
}

        try {
            const response = await fetch(`/api/gym-booking/cancel/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to cancel booking');
            }

            const data = await response.json();
            return data; // Returns cancellation confirmation
        } catch (err) {
            throw new Error(err.message || 'An error occurred while cancelling the booking');
        }
    }, [user]);

    const deleteBooking = useCallback(
        async (bookingId) => {
            if (!user?.token) {
                throw new Error('User not authenticated');
            }

            try {
                const response = await fetch(`/api/gym-booking/delete/${bookingId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete booking');
                }

                // Optionally, refetch bookings after deletion
                fetchAllBookings();
            } catch (err) {
                console.error('Error deleting booking:', err);
                throw err;
            }
        },
        [user, fetchAllBookings]
    );

    const getFitnessSummary = useCallback(() => {
        const fitness = profile?.profile?.fitness || {};
        const goals = fitness.fitnessGoals || [];
        const workouts = fitness.workoutLogs || [];

        const totalGoals = goals.length;
        const totalWorkouts = workouts.length;

        const totalProgress = goals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
        const averageProgress = totalGoals > 0 ? Number((totalProgress / totalGoals).toFixed(2)) : 0;

        return {
            totalWorkouts,
            totalGoals,
            averageProgress,
        };
    }, [profile]);

    return { fetchTotalBookings, fetchAllBookings, cancelBooking, deleteBooking, getFitnessSummary };
};


