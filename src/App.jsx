
import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import Transactions from "./components/Transactions";
import Income from "./components/Income";
import Expenses from "./components/Expenses";
import Budget from "./components/Budget";
import Settings from "./components/Setting";
import DeleteHistory from "./components/DeleteHistory";
import Admin from "./components/Admin";

import Login from "./components/Login";
import Register from "./components/Register";

import "./App.css";


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children }) {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    // User is not logged in
    if (!isLoggedIn) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}


/* =========================================================
   ADMIN-ONLY ROUTE
========================================================= */

function AdminRoute({ children }) {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    let currentUser = null;

    /* Safely read current user */
    try {

        const storedUser =
            localStorage.getItem("currentUser");

        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        }

    } catch (error) {

        console.error(
            "Could not read current user:",
            error
        );

        currentUser = null;
    }


    const isAdmin =
        currentUser &&
        currentUser.role === "admin";


    /* Not logged in */
    if (!isLoggedIn) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    /* Logged in but not admin */
    if (!isAdmin) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    /* Admin */
    return children;
}


/* =========================================================
   DASHBOARD LAYOUT
========================================================= */

function DashboardLayout() {

    return (
        <>

            <Navbar />

            <Sidebar />

            <main className="main">

                <Routes>

                    {/* =================================
                        DASHBOARD
                    ================================= */}

                    <Route
                        path="/"
                        element={
                            <Dashboard />
                        }
                    />


                    {/* =================================
                        REPORTS
                    ================================= */}

                    <Route
                        path="/reports"
                        element={
                            <Reports />
                        }
                    />


                    {/* =================================
                        TRANSACTIONS
                    ================================= */}

                    <Route
                        path="/transactions"
                        element={
                            <Transactions />
                        }
                    />


                    {/* =================================
                        INCOME
                    ================================= */}

                    <Route
                        path="/income"
                        element={
                            <Income />
                        }
                    />


                    {/* =================================
                        EXPENSES
                    ================================= */}

                    <Route
                        path="/expenses"
                        element={
                            <Expenses />
                        }
                    />


                    {/* =================================
                        BUDGET
                    ================================= */}

                    <Route
                        path="/budget"
                        element={
                            <Budget />
                        }
                    />


                    {/* =================================
                        DELETE HISTORY
                    ================================= */}

                    <Route
                        path="/delete-history"
                        element={
                            <DeleteHistory />
                        }
                    />


                    {/* =================================
                        SETTINGS
                    ================================= */}

                    <Route
                        path="/settings"
                        element={
                            <Settings />
                        }
                    />


                    {/* =================================
                        ADMIN DASHBOARD
                    ================================= */}

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <Admin />
                            </AdminRoute>
                        }
                    />


                    {/* =================================
                        UNKNOWN PAGE
                    ================================= */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />

                </Routes>

            </main>

        </>
    );
}


/* =========================================================
   APP
========================================================= */

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =================================
                    LOGIN
                ================================= */}

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />


                {/* =================================
                    REGISTER
                ================================= */}

                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                {/* =================================
                    PROTECTED DASHBOARD
                ================================= */}

                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;

