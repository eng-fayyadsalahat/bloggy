import React, {Suspense} from "react";
import RequireAuth from "./context/requireAuth";
import {HomePage, Login, Register, Settings, Summery, Single, Write, Error} from "./lazyComponents";
import Loading from "./pages/lazy_loading/loading"

import Search from "./components/search/articleSearch";


import {BrowserRouter, Routes, Route} from "react-router-dom";


function RoutePage() {


    return (<BrowserRouter>
        <Routes>
            {/*Home Page*/}
            <Route exact path="/" element={<Suspense fallback={<Loading/>}>
                <HomePage/>
            </Suspense>}/>

            <Route path="/login" element={<Suspense fallback={<Loading/>}>
                <Login/>
            </Suspense>}/>

            <Route path="/signup" element={<Suspense fallback={<Loading/>}>
                <Register/>
            </Suspense>}/>


            <Route path="/article/:id" element={<Suspense fallback={<Loading/>}>
                <Single/>
            </Suspense>}/>


            <Route path="/article/write" element={<Suspense fallback={<Loading/>}>
                <RequireAuth>
                    <Write/>
                </RequireAuth>
            </Suspense>}/>


            <Route path="/article/summery" element={<Suspense fallback={<Loading/>}>
                <RequireAuth>
                    <Summery/>
                </RequireAuth>
            </Suspense>}/>

            <Route path="/settings" element={<Suspense fallback={<Loading/>}>
                <RequireAuth>
                    <Settings/>
                </RequireAuth>
            </Suspense>}/>

            <Route path="/error" element={<Suspense fallback={<Loading/>}>
                <Error/>
            </Suspense>}/>

            <Route path="/search" element={<Search/>}></Route>


        </Routes>

    </BrowserRouter>);
}

export default RoutePage;

