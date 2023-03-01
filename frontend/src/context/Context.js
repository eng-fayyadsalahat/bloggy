import {createContext, useEffect, useReducer} from "react";
import Reducer from "./Reducer"
import React from "react";

import useLocalStorage from "./useLocalStorage";


const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    isFetching: false,
    error: false,
    isLogin: false,

};

export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);
    const [user, setUser] = useLocalStorage("user",)
    useEffect(() => {
        setUser(state.user);
    }, [state.user]);
    return (
        <Context.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                isLogin: state.isLogin,
                dispatch,
            }}
        >
            {children}
        </Context.Provider>
    );
};