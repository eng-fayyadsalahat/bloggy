import {lazy} from "react";

export const HomePage = lazy(() => import("./pages/home/Home"));
export const Register = lazy(() => import("./pages/register/Register"));

export const Login = lazy(() => import("./pages/login/Login"));

export const Single = lazy(() => import("./pages/single/Single"));

export const Summery = lazy(() => import("./pages/summery/summery"));

export const Write = lazy(() => import("./pages/write/Write"));

export const Settings = lazy(()=> import("./pages/settings/Settings"));

export const Error = lazy(() => import("./pages/error/Error"));