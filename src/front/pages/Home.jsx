import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const navigate = useNavigate();

	const loadMessage = async () => {
		const backendUrl = import.meta.env.VITE_BACKEND_URL

		if (!backendUrl) {
			throw new Error("VITE_BACKEND_URL is not defined in .env file")
		}

		const response = await fetch(backendUrl + "/api/hello")

		if (!response.ok) {
			throw new Error(
				`Could not fetch the message from the backend. Status: ${response.status} ${response.statusText}`
			);
		}

		const data = await response.json()
		if (response.ok) dispatch({ type: "set_hello", payload: data.message })
		return data
	}

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const login = async (email, password) => {
		try {
			const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			})

			if (!response.ok) {
				if (response.status === 401) return { success: false, error: "Invalid credentials" }
				else if (response.status === 404) return { success: false, error: "User not found" }
				else return { success: false, error: "Login failed" }
			}

			const data = await response.json()
			localStorage.setItem("token", data.access_token)
			localStorage.setItem("userEmail", email)
			return { success: true, data }
		} catch (err) {
			return { success: false, error: err.message || "Login failed" }
		}
	}

	const signUp = async (email, password) => {
		try {
			const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			})

			if (!response.ok) {
				const body = await response.json().catch(() => ({}))
				return { success: false, error: body.msg || "Sign up failed" }
			}

			return { success: true }
		} catch (err) {
			return { success: false, error: err.message || "Sign up failed" }
		}
	}

	const handleSignUp = async () => {
		setError("")
		setIsLoading(true)

		const signUpResult = await signUp(email, password)
		if (!signUpResult.success) {
			setError(signUpResult.error || "Could not sign up")
		} else {
			const loginResult = await login(email, password)
			if (!loginResult.success) {
				setError(loginResult.error || "Login after sign up failed")
			} else {
				dispatch({ type: "set_hello", payload: "Signed up and logged in successfully" })
				navigate("/")
			}
		}

		setIsLoading(false)
	}

	const handleLogin = async (event) => {
		event.preventDefault()
		setError("")
		setIsLoading(true)

		const loginResult = await login(email, password)

		if (!loginResult.success) {
			setError(loginResult.error || "Login failed")
			setIsLoading(false)
			return
		}

		dispatch({ type: "set_hello", payload: "Logged in successfully" })
		navigate("/user")
		setIsLoading(false)
	}

	useEffect(() => {
		loadMessage()
	}, [])

	// do I need to add an onSubmit function to the form that calls the login function?
	// do I need to import password and email from somewhere? or do I need to create a useState for them?
	return (
		<div className="text-center mt-5 ">
			<h1 className="display-4 mb-5">Welcome to the Star Wars Dictionary</h1>
			<form onSubmit={handleLogin}>
				<div className="m-auto">
					<label>Email:</label>
					<input
						type="text-center"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="text-center mt-1">
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="mt-3">
				<button className="btn btn-success me-3" type="submit" disabled={isLoading}>Login</button>
			<button className="btn btn-success" type="button" onClick={handleSignUp} disabled={isLoading}>Sign Up</button>
				</div>
			</form>
			{error && <p className="text-danger">{error}</p>}
			{isLoading && <p>Checking credentials...</p>}
		</div>
	);
}; 