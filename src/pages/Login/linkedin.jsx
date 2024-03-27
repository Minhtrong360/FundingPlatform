import React, { useState } from "react";
import { LinkedIn } from "react-linkedin-login-oauth2";
import axios from "axios";
// import { toast } from "react-toastify";
import AlertMsg from "../../components/AlertMsg";
import { message } from "antd";

function LinkedInLoginComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleSuccess = async (data) => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }
      const accessToken = await getAccessToken(data.code);
      const profileData = await fetchLinkedInData(accessToken);
      setData(profileData);
    } catch (error) {
      setError("Error fetching LinkedIn data");
    }
  };

  const handleFailure = (error) => {
    setError(error.message);
  };

  const getAccessToken = async (code) => {
    // Replace with your LinkedIn access token URL and parameters
    const response = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:3000/",
        client_id: "3tVV3KM4V9D1qjIL",
        client_secret: "3tVV3KM4V9D1qjIL",
      }
    );
    return response.data.access_token;
  };

  const fetchLinkedInData = async (accessToken) => {
    // Replace with the LinkedIn API endpoint you need
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const response = await axios.get("LINKEDIN_API_ENDPOINT", config);
    return response.data;
  };

  return (
    <div>
      <AlertMsg />
      <LinkedIn
        clientId="YOUR_CLIENT_ID"
        onFailure={handleFailure}
        onSuccess={handleSuccess}
        redirectUri="YOUR_REDIRECT_URI"
        scope="r_liteprofile r_emailaddress w_member_social" // Adjust scope as needed
      />
      {data && <div>{JSON.stringify(data, null, 2)}</div>}
      {error && <div>{error}</div>}
    </div>
  );
}

export default LinkedInLoginComponent;
