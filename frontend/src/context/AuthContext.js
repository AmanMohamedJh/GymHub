import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };

    case "LOGOUT":
      return { user: null };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// what happen in this

/*This code defines an authentication context using React's Context API and useReducer to manage user 
authentication state across the app. It provides an AuthContext with a reducer that handles LOGIN and
 LOGOUT actions, updating the user state accordingly. The AuthProvider component initializes the state,
  checks localStorage for a logged-in user on mount (to persist authentication), and provides the authentication
   state and dispatch function to all child components. This ensures a centralized and easily accessible
    authentication system,
 allowing users to stay logged in even after refreshing the page. */
