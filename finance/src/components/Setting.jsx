
import React, { useEffect, useState } from "react";

import {
    FaUser,
    FaBell,
    FaLock,
    FaMoneyBillWave,
    FaMoon,
    FaSave
} from "react-icons/fa";

import { useCurrency } from "./CurrencyContext";

import "./Setting.css";


function Settings() {

    /* ================================
       STATE
    ================================= */

    const [notifications, setNotifications] =
        useState(true);

    const [darkMode, setDarkMode] =
        useState(
            localStorage.getItem("darkMode") === "true"
        );


    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");


    /* ================================
       CURRENCY
    ================================= */

    const {
        currency,
        setCurrency
    } = useCurrency();


    /* ================================
       LOAD CURRENT USER
    ================================= */

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem("currentUser");

            if (storedUser) {

                const user =
                    JSON.parse(storedUser);

                setName(user.name || "");
                setEmail(user.email || "");

            }

        } catch (error) {

            console.error(
                "Could not load user:",
                error
            );

        }

    }, []);


    /* ================================
       DARK MODE
    ================================= */

    useEffect(() => {

        if (darkMode) {

            document.body.classList.add(
                "dark-mode"
            );

        } else {

            document.body.classList.remove(
                "dark-mode"
            );

        }

        localStorage.setItem(
            "darkMode",
            darkMode
        );

    }, [darkMode]);


    /* ================================
       SAVE SETTINGS
    ================================= */

    const handleSave = (e) => {

        e.preventDefault();


        try {

            const storedUser =
                localStorage.getItem("currentUser");


            if (storedUser) {

                const user =
                    JSON.parse(storedUser);


                const updatedUser = {
                    ...user,
                    name: name,
                    email: email
                };


                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(updatedUser)
                );


                /* Tell Navbar that
                   user information changed */

                window.dispatchEvent(
                    new Event("userChanged")
                );

            }


            alert(
                "Settings saved successfully!"
            );

        } catch (error) {

            console.error(
                "Could not save settings:",
                error
            );

            alert(
                "Could not save settings."
            );

        }

    };


    /* ================================
       RENDER
    ================================= */

    return (

        <div className="settings-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="settings-header">

                <div>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage your account and preferences
                    </p>

                </div>

            </div>


            {/* =================================
                PROFILE
            ================================= */}

            <div className="settings-section">

                <div className="settings-title">

                    <FaUser />

                    <div>

                        <h2>
                            Profile
                        </h2>

                        <p>
                            Update your personal information
                        </p>

                    </div>

                </div>


                <form onSubmit={handleSave}>

                    <div className="form-grid">


                        {/* NAME */}

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your name"
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your email"
                            />

                        </div>

                    </div>


                    {/* =================================
                        CURRENCY
                    ================================= */}

                    <div className="currency-setting">

                        <div className="settings-title">

                            <FaMoneyBillWave />

                            <div>

                                <h2>
                                    Currency
                                </h2>

                                <p>
                                    Select the currency used
                                    throughout your dashboard
                                </p>

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Default Currency
                            </label>

                            <select
                                value={currency}
                                onChange={(e) =>
                                    setCurrency(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="FCFA">
                                    FCFA - Central African CFA Franc
                                </option>

                                <option value="USD">
                                    USD - US Dollar
                                </option>

                                <option value="EUR">
                                    EUR - Euro
                                </option>

                                <option value="GBP">
                                    GBP - British Pound
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* =================================
                        SAVE
                    ================================= */}

                    <button
                        type="submit"
                        className="save-btn"
                    >

                        <FaSave />

                        Save Changes

                    </button>

                </form>

            </div>


            {/* =================================
                NOTIFICATIONS
            ================================= */}

            <div className="settings-section">

                <div className="settings-title">

                    <FaBell />

                    <div>

                        <h2>
                            Notifications
                        </h2>

                        <p>
                            Manage your notification preferences
                        </p>

                    </div>

                </div>


                <div className="setting-row">

                    <div>

                        <h3>
                            Email Notifications
                        </h3>

                        <p>
                            Receive notifications about
                            your finances
                        </p>

                    </div>


                    <label className="switch">

                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={() =>
                                setNotifications(
                                    !notifications
                                )
                            }
                        />

                        <span className="slider"></span>

                    </label>

                </div>

            </div>


            {/* =================================
                APPEARANCE
            ================================= */}

            <div className="settings-section">

                <div className="settings-title">

                    <FaMoon />

                    <div>

                        <h2>
                            Appearance
                        </h2>

                        <p>
                            Customize the appearance
                            of your dashboard
                        </p>

                    </div>

                </div>


                <div className="setting-row">

                    <div>

                        <h3>
                            Dark Mode
                        </h3>

                        <p>
                            Switch between light and
                            dark mode
                        </p>

                    </div>


                    <label className="switch">

                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={() =>
                                setDarkMode(
                                    !darkMode
                                )
                            }
                        />

                        <span className="slider"></span>

                    </label>

                </div>

            </div>


            {/* =================================
                SECURITY
            ================================= */}

            <div className="settings-section">

                <div className="settings-title">

                    <FaLock />

                    <div>

                        <h2>
                            Security
                        </h2>

                        <p>
                            Manage your account security
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="password-btn"
                    onClick={() =>
                        alert(
                            "Password change feature coming soon."
                        )
                    }
                >
                    Change Password
                </button>

            </div>

        </div>
    );
}


export default Settings;

