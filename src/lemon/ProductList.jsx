// React component for subscribing and redirecting to the checkout page

import React, { useState } from "react";
import axios from "axios";

const SubscriptionPage = () => {
  const [productId, setProductId] = useState("");

  const handleSubscribe = async () => {
    try {
      // Replace YOUR_CHECKOUT_URL with the actual checkout URL provided by Lemon Squeezy
      const checkoutUrl = `https://beekrowd.lemonsqueezy.com/checkout/buy/91859a0d-8549-46e4-8913-59c330f7b5fd`;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.log("Error redirecting to checkout:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <button onClick={handleSubscribe}>Subscribe</button>
    </div>
  );
};

export default SubscriptionPage;
