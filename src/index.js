import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router.jsx";
import { Elements } from "@stripe/react-stripe-js";
import AuthProvider from "./context/AuthContext.jsx";
import { loadStripe } from "@stripe/stripe-js";

const root = ReactDOM.createRoot(document.getElementById("root"));
const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);
root.render(
  <AuthProvider>
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        {/* <ThemeProvider> */}
        <Router />
        {/* </ThemeProvider> */}
      </BrowserRouter>
    </Elements>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
