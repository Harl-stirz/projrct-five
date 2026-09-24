
import React, { useEffect, useState } from "react";

import {
    FaUsers,
    FaUserShield,
    FaMoneyBillWave,
    FaArrowUp,
    FaArrowDown,
    FaExchangeAlt,
    FaChartLine,
    FaUserPlus,
    FaCog,
    FaTrash,
    FaEdit
} from "react-icons/fa";

import "./Admin.css";


function Admin() {

    const [currentUser, setCurrentUser] =
        useState(null);


    /* =========================================
       USERS
    ========================================= */

    const [users, setUsers] =
        useState([]);

    const [loadingUsers, setLoadingUsers] =
        useState(true);

    const [usersError, setUsersError] =
        useState("");


    /* =========================================
       SHOW / HIDE USERS
    ========================================= */

    const [showUsers, setShowUsers] =
        useState(false);


    /* =========================================
       ADMIN STATISTICS
    ========================================= */

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalTransactions: 0
    });


    /* =========================================
       LOAD CURRENT ADMIN
    ========================================= */

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem("currentUser");

            if (storedUser) {

                setCurrentUser(
                    JSON.parse(storedUser)
                );

            }

        } catch (error) {

            console.error(
                "Could not load admin:",
                error
            );

        }

    }, []);


    /* =========================================
       LOAD USERS FROM DATABASE
    ========================================= */

    useEffect(() => {

        const fetchUsers = async () => {

            try {

                setLoadingUsers(true);
                setUsersError("");

                const response =
                    await fetch(
                        "http://localhost:5000/users"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to load users"
                    );

                }


                const data =
                    await response.json();


                setUsers(data);


                // Update total users
                setStats((previousStats) => ({
                    ...previousStats,
                    totalUsers: data.length
                }));


            } catch (error) {

                console.error(
                    "Error loading users:",
                    error
                );

                setUsersError(
                    "Unable to load users from the database."
                );

            } finally {

                setLoadingUsers(false);

            }

        };


        fetchUsers();

    }, []);


    /* =========================================
       ADMIN STATISTICS
    ========================================= */

    useEffect(() => {

        setStats((previousStats) => ({
            ...previousStats,

            totalIncome: 8450000,
            totalExpenses: 3240000,
            totalTransactions: 87

        }));

    }, []);


    /* =========================================
       FORMAT MONEY
    ========================================= */

    const formatMoney = (amount) => {

        return new Intl.NumberFormat(
            "en-US"
        ).format(amount);

    };


    /* =========================================
       TOGGLE USERS
    ========================================= */

    const handleViewUsers = () => {

        setShowUsers(
            (previousValue) =>
                !previousValue
        );

    };


    /* =========================================
       DELETE USER
    ========================================= */

    const handleDeleteUser = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this user?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `http://localhost:5000/users/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete user"
                );

            }


            // Remove deleted user from screen
            setUsers((previousUsers) =>
                previousUsers.filter(
                    (user) => user.id !== id
                )
            );


            // Update total users
            setStats((previousStats) => ({
                ...previousStats,
                totalUsers:
                    previousStats.totalUsers - 1
            }));


        } catch (error) {

            console.error(
                "Delete user error:",
                error
            );

            alert(
                "Failed to delete user."
            );

        }

    };


    return (

        <div className="admin-page">


            {/* =====================================
                ADMIN HEADER
            ===================================== */}

            <div className="admin-header">

                <div>

                    <div className="admin-title">

                        <FaUserShield />

                        <div>

                            <h1>
                                Admin Dashboard
                            </h1>

                            <p>
                                Manage your finance platform
                                and monitor system activity.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="admin-welcome">

                    <span>
                        Welcome back
                    </span>

                    <strong>
                        {currentUser?.name || "Admin"}
                    </strong>

                </div>

            </div>


            {/* =====================================
                STATISTICS
            ===================================== */}

            <div className="admin-stats">


                {/* USERS */}

                <div className="admin-card">

                    <div className="admin-card-icon users">

                        <FaUsers />

                    </div>

                    <div>

                        <p>
                            Total Users
                        </p>

                        <h2>
                            {stats.totalUsers}
                        </h2>

                        <span className="stat-positive">

                            <FaArrowUp />

                            Registered accounts

                        </span>

                    </div>

                </div>


                {/* INCOME */}

                <div className="admin-card">

                    <div className="admin-card-icon income">

                        <FaMoneyBillWave />

                    </div>

                    <div>

                        <p>
                            Total Income
                        </p>

                        <h2>
                            {formatMoney(
                                stats.totalIncome
                            )}
                        </h2>

                        <span className="stat-positive">

                            <FaArrowUp />

                            Recorded income

                        </span>

                    </div>

                </div>


                {/* EXPENSES */}

                <div className="admin-card">

                    <div className="admin-card-icon expenses">

                        <FaArrowDown />

                    </div>

                    <div>

                        <p>
                            Total Expenses
                        </p>

                        <h2>
                            {formatMoney(
                                stats.totalExpenses
                            )}
                        </h2>

                        <span className="stat-negative">

                            <FaArrowDown />

                            Recorded expenses

                        </span>

                    </div>

                </div>


                {/* TRANSACTIONS */}

                <div className="admin-card">

                    <div className="admin-card-icon transactions">

                        <FaExchangeAlt />

                    </div>

                    <div>

                        <p>
                            Transactions
                        </p>

                        <h2>
                            {stats.totalTransactions}
                        </h2>

                        <span className="stat-positive">

                            <FaChartLine />

                            System activity

                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================
                ADMIN CONTENT
            ===================================== */}

            <div className="admin-grid">


                {/* =================================
                    USER MANAGEMENT
                ================================= */}

                <div className="admin-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                User Management
                            </h2>

                            <p>
                                Manage registered users
                            </p>

                        </div>

                        <FaUsers />

                    </div>


                    <div className="admin-actions">


                        {/* VIEW USERS */}

                        <button
                            className={`admin-action ${
                                showUsers
                                    ? "active"
                                    : ""
                            }`}
                            onClick={
                                handleViewUsers
                            }
                        >

                            <FaUsers />

                            <div>

                                <strong>

                                    {showUsers
                                        ? "Hide Users"
                                        : loadingUsers
                                            ? "Loading Users..."
                                            : `View Users (${users.length})`
                                    }

                                </strong>

                                <span>

                                    {showUsers
                                        ? "Hide registered users"
                                        : "View all registered users"
                                    }

                                </span>

                            </div>

                        </button>


                        {/* ADD USER */}

                        <button className="admin-action">

                            <FaUserPlus />

                            <div>

                                <strong>
                                    Add User
                                </strong>

                                <span>
                                    Create a new user account
                                </span>

                            </div>

                        </button>


                        {/* MANAGE ADMINS */}

                        <button className="admin-action">

                            <FaUserShield />

                            <div>

                                <strong>
                                    Manage Admins
                                </strong>

                                <span>
                                    Manage administrator access
                                </span>

                            </div>

                        </button>

                    </div>


                    {/* =================================
                        USERS TABLE
                        ONLY SHOWS WHEN CLICKED
                    ================================= */}

                    {showUsers && (

                        <div className="users-section">

                            <div className="users-section-header">

                                <div>

                                    <h3>
                                        Registered Users
                                    </h3>

                                    <p>
                                        Users currently stored in
                                        the database
                                    </p>

                                </div>

                                <FaUsers />

                            </div>


                            {/* LOADING */}

                            {loadingUsers && (

                                <div className="users-message">

                                    Loading users...

                                </div>

                            )}


                            {/* ERROR */}

                            {!loadingUsers &&
                                usersError && (

                                    <div className="users-message error">

                                        {usersError}

                                    </div>

                                )}


                            {/* NO USERS */}

                            {!loadingUsers &&
                                !usersError &&
                                users.length === 0 && (

                                    <div className="users-message">

                                        No users found.

                                    </div>

                                )}


                            {/* USERS TABLE */}

                            {!loadingUsers &&
                                !usersError &&
                                users.length > 0 && (

                                    <div className="users-table-wrapper">

                                        <table className="users-table">

                                            <thead>

                                                <tr>

                                                    <th>
                                                        ID
                                                    </th>

                                                    <th>
                                                        Name
                                                    </th>

                                                    <th>
                                                        Email
                                                    </th>

                                                    <th>
                                                        Role
                                                    </th>

                                                    <th>
                                                        Created
                                                    </th>

                                                    <th>
                                                        Actions
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {users.map(
                                                    (user) => (

                                                        <tr
                                                            key={
                                                                user.id
                                                            }
                                                        >

                                                            <td>
                                                                {user.id}
                                                            </td>

                                                            <td>
                                                                {user.name}
                                                            </td>

                                                            <td>
                                                                {user.email}
                                                            </td>

                                                            <td>

                                                                <span
                                                                    className={
                                                                        user.role ===
                                                                        "admin"
                                                                            ? "role-badge admin-role"
                                                                            : "role-badge user-role"
                                                                    }
                                                                >

                                                                    {
                                                                        user.role
                                                                    }

                                                                </span>

                                                            </td>

                                                            <td>

                                                                {new Date(
                                                                    user.created_at
                                                                ).toLocaleDateString()}

                                                            </td>

                                                            <td>

                                                                <div className="user-actions">


                                                                    {/* EDIT */}

                                                                    <button
                                                                        className="user-edit-btn"
                                                                        title="Edit user"
                                                                    >

                                                                        <FaEdit />

                                                                    </button>


                                                                    {/* DELETE */}

                                                                    <button
                                                                        className="user-delete-btn"
                                                                        title="Delete user"
                                                                        onClick={() =>
                                                                            handleDeleteUser(
                                                                                user.id
                                                                            )
                                                                        }
                                                                    >

                                                                        <FaTrash />

                                                                    </button>

                                                                </div>

                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                        </div>

                    )}

                </div>


                {/* =================================
                    SYSTEM MANAGEMENT
                ================================= */}

                <div className="admin-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                System Management
                            </h2>

                            <p>
                                Manage platform settings
                            </p>

                        </div>

                        <FaCog />

                    </div>


                    <div className="admin-actions">

                        <button className="admin-action">

                            <FaChartLine />

                            <div>

                                <strong>
                                    Financial Reports
                                </strong>

                                <span>
                                    Review platform financial data
                                </span>

                            </div>

                        </button>


                        <button className="admin-action">

                            <FaExchangeAlt />

                            <div>

                                <strong>
                                    Transactions
                                </strong>

                                <span>
                                    Monitor system transactions
                                </span>

                            </div>

                        </button>


                        <button className="admin-action">

                            <FaCog />

                            <div>

                                <strong>
                                    System Settings
                                </strong>

                                <span>
                                    Configure dashboard settings
                                </span>

                            </div>

                        </button>

                    </div>

                </div>

            </div>


            {/* =====================================
                ADMIN INFORMATION
            ===================================== */}

            <div className="admin-info">

                <div className="admin-info-icon">

                    <FaUserShield />

                </div>

                <div>

                    <h3>
                        Administrator Access
                    </h3>

                    <p>
                        You are currently signed in as an
                        administrator. Administrative features
                        are restricted to authorized users.
                    </p>

                </div>

            </div>

        </div>

    );

}


export default Admin;
