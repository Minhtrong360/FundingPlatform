import Stripe from "stripe";

export const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});
