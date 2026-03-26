import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-dark bg-black">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Earth</span>
				</Link>
			</div>
		</nav>
	);
};