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

	// I NEED A USE STATE HERE TO SAVE USERNAME AND PASSWORD - from the form??


	// const login = async (email, password) => {
	// 	const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({ email, password })
	// 	})
	// 	if (!response.ok) {
	// 		if (response.status === 401) throw new Error("Invalid credentials")
	// 		else if (response.status === 400) throw new Error("User not found")
	// 		else throw new Error("Login failed")
	// 	}
	// 	const data = await response.json()
	// 	localStorage.setItem("token", data.access_token);

	// 	return data
	// }


	useEffect(() => {
		loadMessage()
	}, [])

	// do I need to add an onSubmit function to the form that calls the login function?
	// do I need to import password and email from somewhere? or do I need to create a useState for them?
	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Welcome to the Star Wars API</h1>
			{<form>
				<div>
					<label>Email:</label>
					<input
						type="email"
						//value={email} user.email ??
						//onChange={(e) => setEmail(e.target.value)}
						//required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						//value={password}
						//onChange={(e) => setPassword(e.target.value)}
						//required
					/>
				</div>
				<button className="btn btn-primary me-3" type = "submit" onClick={loadMessage}>Login!</button>
				<button className="btn btn-secondary" type = "submit" onClick={loadMessage}>Sign Up!</button>
			</form>}

		</div>
	);
}; 