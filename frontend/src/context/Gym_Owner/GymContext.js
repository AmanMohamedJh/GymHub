import { createContext, useReducer } from 'react';

export const GymContext = createContext();

export const gymReducer = (state, action) => {
    switch (action.type) {
        case 'SET_GYMS':
            return {
                ...state,
                gyms: action.payload
            };
        case 'ADD_GYM':
            return {
                ...state,
                gyms: [...state.gyms, action.payload]
            };
        case 'UPDATE_GYM':
            return {
                ...state,
                gyms: state.gyms.map(gym => 
                    gym._id === action.payload._id ? action.payload : gym
                )
            };
        case 'DELETE_GYM':
            return {
                ...state,
                gyms: state.gyms.filter(gym => gym._id !== action.payload)
            };
        case 'UPDATE_GYM_STATUS':
            return {
                ...state,
                gyms: state.gyms.map(gym =>
                    gym._id === action.payload.gymId 
                        ? { ...gym, status: action.payload.status }
                        : gym
                )
            };
        default:
            return state;
    }
};

export const GymContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gymReducer, {
        gyms: []
    });

    return (
        <GymContext.Provider value={{ ...state, dispatch }}>
            {children}
        </GymContext.Provider>
    );
};
