import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";

import "./App.css";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Sidebar />

            <main className="main">

                <Routes>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />

                </Routes>

            </main>

        </BrowserRouter>
    );
}

export default App;