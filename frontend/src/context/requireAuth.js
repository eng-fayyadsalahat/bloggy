import React from "react";

import {useLocation, Navigate} from "react-router-dom";
import useAuth from "./useAuth";

export default function RequireAuth({children}) {
    let {user} = useAuth();
    let location = useLocation();

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{from: location}} replace/>;
    }
    if (localStorage.getItem("user") == null){
        return <Navigate to="/login" replace />;
    }

    else {
        return children;
    }


}