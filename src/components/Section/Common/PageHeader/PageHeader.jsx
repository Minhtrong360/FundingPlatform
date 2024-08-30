import { Link } from "react-router-dom";

const PageHeader = ({ title }) => {
	return (
		<div className="zubuz-breadcrumb">
			<div className="container">
				<h1 className="post__title">{title}</h1>
				<nav className="breadcrumbs">
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li aria-current="page"> {title}</li>
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default PageHeader;
