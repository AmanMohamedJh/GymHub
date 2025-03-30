import { createContext, useReducer } from 'react';

export const EquipmentContext = createContext();

export const equipmentReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EQUIPMENT':
            return {
                ...state,
                equipment: action.payload
            };
        case 'ADD_EQUIPMENT':
            return {
                ...state,
                equipment: [...state.equipment, action.payload]
            };
        case 'UPDATE_EQUIPMENT':
            return {
                ...state,
                equipment: state.equipment.map(item => 
                    item._id === action.payload._id ? action.payload : item
                )
            };
        case 'DELETE_EQUIPMENT':
            return {
                ...state,
                equipment: state.equipment.filter(item => item._id !== action.payload)
            };
        case 'SET_INVENTORY':
            return {
                ...state,
                inventory: action.payload
            };
        default:
            return state;
    }
};

export const EquipmentContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(equipmentReducer, {
        equipment: [],
        inventory: []
    });

    return (
        <EquipmentContext.Provider value={{ ...state, dispatch }}>
            {children}
        </EquipmentContext.Provider>
    );
};
