import React, { useEffect, useState } from "react";
import {
    FaSearch,
    FaBell,
    FaUserCircle,
    FaMoon,
    FaSun,
    FaTimes,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaMoneyBillWave
} from "react-icons/fa";

function Navbar({ searchTerm, setSearchTerm }) {

    const [darkMode, setDarkMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    /* =========================================================
       LOAD CURRENT USER
    ========================================================= */

    useEffect(() => {

        const loadUser = () => {

            const storedUser =
                localStorage.getItem("currentUser");

            if (storedUser) {

                try {

                    setCurrentUser(
                        JSON.parse(storedUser)
                    );

                } catch (error) {

                    console.error(
                        "Error loading current user:",
                        error
                    );

                    setCurrentUser(null);
                }

            } else {

                setCurrentUser(null);

            }
        };

        loadUser();

        window.addEventListener(
            "userChanged",
            loadUser
        );

        return () => {

            window.removeEventListener(
                "userChanged",
                loadUser
            );

        };

    }, []);

    /* =========================================================
       LOAD NOTIFICATIONS
    ========================================================= */

    useEffect(() => {

        const savedNotifications =
            localStorage.getItem("financeNotifications");

        if (savedNotifications) {

            try {

                setNotifications(
                    JSON.parse(savedNotifications)
                );

            } catch (error) {

                console.error(
                    "Error loading notifications:",
                    error
                );

                createDefaultNotifications();
            }

        } else {

            createDefaultNotifications();

        }

    }, []);

    /* =========================================================
       DEFAULT NOTIFICATIONS
    ========================================================= */

    const createDefaultNotifications = () => {

        const defaultNotifications = [

            {
                id: 1,
                type: "success",
                title: "Welcome to Finance Dashboard",
                message:
                    "Your finance dashboard is ready to use.",
                time: "Just now",
                read: false
            },

            {
                id: 2,
                type: "warning",
                title: "Budget Reminder",
                message:
                    "Review your current monthly budget.",
                time: "10 minutes ago",
                read: false
            },

            {
                id: 3,
                type: "info",
                title: "Expense Tracking",
                message:
                    "Remember to record your latest expenses.",
                time: "1 hour ago",
                read: false
            }

        ];

        setNotifications(defaultNotifications);

        localStorage.setItem(
            "financeNotifications",
            JSON.stringify(defaultNotifications)
        );

    };

    /* =========================================================
       SAVE NOTIFICATIONS
    ========================================================= */

    useEffect(() => {

        localStorage.setItem(
            "financeNotifications",
            JSON.stringify(notifications)
        );

    }, [notifications]);

    /* =========================================================
       DARK MODE
    ========================================================= */

    const toggleDarkMode = () => {

        const newMode = !darkMode;

        setDarkMode(newMode);

        document.body.classList.toggle(
            "dark-mode",
            newMode
        );

    };

    /* =========================================================
       UNREAD COUNT
    ========================================================= */

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.read
        ).length;

    /* =========================================================
       MARK AS READ
    ========================================================= */

    const markAsRead = (id) => {

        setNotifications(
            (currentNotifications) =>
                currentNotifications.map(
                    (notification) =>
                        notification.id === id
                            ? {
                                ...notification,
                                read: true
                            }
                            : notification
                )
        );

    };

    /* =========================================================
       MARK ALL AS READ
    ========================================================= */

    const markAllAsRead = () => {

        setNotifications(
            (currentNotifications) =>
                currentNotifications.map(
                    (notification) => ({
                        ...notification,
                        read: true
                    })
                )
        );

    };

    /* =========================================================
       CLEAR ALL
    ========================================================= */

    const clearNotifications = () => {

        setNotifications([]);

    };

    /* =========================================================
       GET NOTIFICATION ICON
    ========================================================= */

    const getNotificationIcon = (type) => {

        if (type === "success") {
            return <FaCheckCircle />;
        }

        if (type === "warning") {
            return <FaExclamationTriangle />;
        }

        if (type === "money") {
            return <FaMoneyBillWave />;
        }

        return <FaInfoCircle />;

    };

    /* =========================================================
       CLOSE WHEN CLICKING OUTSIDE
    ========================================================= */

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                !event.target.closest(
                    ".notification-wrapper"
                )
            ) {

                setShowNotifications(false);

            }

        };

        document.addEventListener(
            "click",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "click",
                handleClickOutside
            );

        };

    }, []);

    return (

        <header className="navbar">

            {/* =================================================
                LEFT
            ================================================= */}

            <div className="navbar-left">
                {/* Sidebar contains logo */}
            </div>


            {/* =================================================
                RIGHT
            ================================================= */}

            <div className="navbar-right">

                {/* =================================================
                    SEARCH
                ================================================= */}

                <div className="search-box">

                    <FaSearch className="search-icon" />

                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                    {searchTerm && (

                        <button
                            type="button"
                            className="clear-search"
                            onClick={() =>
                                setSearchTerm("")
                            }
                        >
                            <FaTimes />
                        </button>

                    )}

                </div>


                {/* =================================================
                    DARK MODE
                ================================================= */}

                <button
                    type="button"
                    className="theme-button"
                    onClick={toggleDarkMode}
                    title="Toggle dark mode"
                    aria-label="Toggle dark mode"
                >
                    {darkMode
                        ? <FaSun />
                        : <FaMoon />
                    }
                </button>


                {/* =================================================
                    USER AREA
                    NOTIFICATION ABOVE USER
                ================================================= */}

                <div className="navbar-user-area">

                    {/* =================================================
                        NOTIFICATION BELL
                    ================================================= */}

                    <div className="notification-wrapper">

                        <button
                            type="button"
                            className="notification"
                            onClick={(e) => {

                                e.stopPropagation();

                                setShowNotifications(
                                    (previous) =>
                                        !previous
                                );

                            }}
                            title="Notifications"
                            aria-label="Notifications"
                        >

                            <FaBell className="bell-icon" />

                            {unreadCount > 0 && (

                                <span className="notification-badge">

                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount}

                                </span>

                            )}

                        </button>


                        {/* =================================================
                            NOTIFICATION DROPDOWN
                        ================================================= */}

                        {showNotifications && (

                            <div
                                className="notification-dropdown"
                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                            >

                                <div className="notification-header">

                                    <div>

                                        <h3>
                                            Notifications
                                        </h3>

                                        <p>
                                            {unreadCount > 0
                                                ? `${unreadCount} unread`
                                                : "All caught up"}
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className="notification-close"
                                        onClick={() =>
                                            setShowNotifications(false)
                                        }
                                        title="Close notifications"
                                    >
                                        <FaTimes />
                                    </button>

                                </div>


                                {notifications.length > 0 && (

                                    <div className="notification-actions">

                                        {unreadCount > 0 && (

                                            <button
                                                type="button"
                                                onClick={markAllAsRead}
                                            >
                                                Mark all as read
                                            </button>

                                        )}

                                        <button
                                            type="button"
                                            onClick={clearNotifications}
                                        >
                                            Clear all
                                        </button>

                                    </div>

                                )}


                                <div className="notification-list">

                                    {notifications.length === 0 ? (

                                        <div className="no-notifications">

                                            <FaBell />

                                            <p>
                                                No notifications
                                            </p>

                                            <span>
                                                You're all caught up.
                                            </span>

                                        </div>

                                    ) : (

                                        notifications.map(
                                            (notification) => (

                                                <button
                                                    type="button"
                                                    key={notification.id}
                                                    className={`notification-item ${
                                                        notification.read
                                                            ? "read"
                                                            : "unread"
                                                    }`}
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                >

                                                    <div
                                                        className={`notification-icon ${notification.type}`}
                                                    >
                                                        {getNotificationIcon(
                                                            notification.type
                                                        )}
                                                    </div>

                                                    <div className="notification-content">

                                                        <strong>
                                                            {notification.title}
                                                        </strong>

                                                        <p>
                                                            {notification.message}
                                                        </p>

                                                        <small>
                                                            {notification.time}
                                                        </small>

                                                    </div>

                                                    {!notification.read && (

                                                        <span className="unread-dot">
                                                        </span>

                                                    )}

                                                </button>

                                            )
                                        )

                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        USER PROFILE
                    ================================================= */}

                    <div className="profile">

                        <FaUserCircle className="profile-icon" />

                        <div className="profile-info">

                            <h4>
                                {currentUser?.name || "User"}
                            </h4>

                            <p>
                                {currentUser?.role === "admin"
                                    ? "Administrator"
                                    : currentUser?.email || "User"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Navbar;