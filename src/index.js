// Supports weights 100-900
import "@fontsource-variable/raleway";
// Supports weights 100-900
import "@fontsource-variable/inter";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import { Provider } from "react-redux";
import store from "./app/store.jsx";
import "./assets/css/bootstrap.min.css";
import "./assets/css/app.css";
import "./assets/css/main.css";
import "./assets/css/react-adjustment.css";
import ScrollToTop from "./components/ScrollToTop.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<AuthProvider>
			<BrowserRouter>
				<ScrollToTop />
				<Router />
			</BrowserRouter>
		</AuthProvider>
	</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
