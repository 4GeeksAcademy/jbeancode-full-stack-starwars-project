import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const login = async (email, password) => {
		const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password })
		})

		if (!response.ok) {
			if (response.status === 401) throw new Error("Invalid credentials")
			else if (response.status === 404) throw new Error("User not found")
			else throw new Error("Login failed")
		}

		const data = await response.json()
		localStorage.setItem("token", data.access_token)
		return data
	}

	const handleLogin = async (event) => {
		event.preventDefault()
		setError("")
		setIsLoading(true)

		//change this error handling (if nots, etc.)
		try {
			await login(email, password)
			dispatch({ type: "set_hello", payload: "Logged in successfully" })
		} catch (err) {
			setError(err.message || "Login failed")
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		loadMessage()
	}, [])

	// do I need to add an onSubmit function to the form that calls the login function?
	// do I need to import password and email from somewhere? or do I need to create a useState for them?
	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Welcome to the Star Wars API</h1>
			<form onSubmit={handleLogin}>
				<div>
					<label>Email:</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button className="btn btn-primary me-3" type="submit" disabled={isLoading}>Login</button>
				<button className="btn btn-secondary" type="button" onClick={loadMessage}>Refresh Message</button>
			</form>
			{error && <p className="text-danger">{error}</p>}
			{isLoading && <p>Checking credentials...</p>}

		</div>
	);
}; 