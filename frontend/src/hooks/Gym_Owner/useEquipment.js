import { useContext } from 'react';
import { EquipmentContext } from '../../context/Gym_Owner/EquipmentContext';
import { useAuthContext } from '../useAuthContext';

export const useEquipment = () => {
    const { dispatch } = useContext(EquipmentContext);
    const { user } = useAuthContext();

    const addEquipment = async (equipmentData) => {
        try {
            const response = await fetch('http://localhost:4000/api/equipment/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(equipmentData)
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error);
            }

            dispatch({ type: 'ADD_EQUIPMENT', payload: json });
            return json;
        } catch (error) {
            throw error;
        }
    };

    const getOwnerEquipment = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/equipment/owner', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error);
            }

            dispatch({ type: 'SET_EQUIPMENT', payload: json });
            return json;
        } catch (error) {
            throw error;
        }
    };

    const getInventoryEquipment = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/equipment/inventory', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error);
            }

            dispatch({ type: 'SET_INVENTORY', payload: json });
            return json;
        } catch (error) {
            throw error;
        }
    };

    const assignEquipmentToGym = async (equipmentId, gymId = null) => {
        try {
            const response = await fetch('http://localhost:4000/api/equipment/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ equipmentId, gymId })
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error);
            }

            // Only update the context if assigning to an existing gym
            if (gymId) {
                dispatch({ type: 'UPDATE_EQUIPMENT', payload: json });
            }

            return json;
        } catch (error) {
            console.error('Error in assignEquipmentToGym:', error);
            throw error;
        }
    };

    return {
        addEquipment,
        getOwnerEquipment,
        getInventoryEquipment,
        assignEquipmentToGym
    };
};

export default useEquipment;
