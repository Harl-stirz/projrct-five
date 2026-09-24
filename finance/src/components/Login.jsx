
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Invalid email or password."
                );

                setLoading(false);
                return;
            }

            /* =================================================
               CHECK LOGIN RESPONSE
            ================================================= */

            if (!data.token || !data.user) {
                setError(
                    "Login failed. Invalid server response."
                );
                setLoading(false);
                return;
            }

            /* =================================================
               SAVE JWT TOKEN
            ================================================= */

            localStorage.setItem(
                "token",
                data.token
            );

            /* =================================================
               SAVE LOGGED-IN USER
            ================================================= */

            localStorage.setItem(
                "currentUser",
                JSON.stringify(data.user)
            );

            /* =================================================
               KEEP LOGIN STATUS
            ================================================= */

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            /* =================================================
               UPDATE NAVBAR IMMEDIATELY
            ================================================= */

            window.dispatchEvent(
                new Event("userChanged")
            );

            /* =================================================
               REDIRECT BASED ON ROLE
            ================================================= */

            if (data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                "Unable to connect to the server. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* FH LOGO */}
                <div className="fh-logo">
                    <span>F</span>
                    <span>H</span>
                </div>

                <h1>Welcome Back</h1>

                <p>
                    Login to your finance dashboard
                </p>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {/* LOGIN FORM */}
                <form onSubmit={handleLogin}>

                    {/* EMAIL */}
                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                {/* REGISTER LINK */}
                <p className="auth-link">
                    Don't have an account?{" "}

                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;
