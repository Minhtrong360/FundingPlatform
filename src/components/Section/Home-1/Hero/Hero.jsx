import { Link } from "react-router-dom";
import { useState } from "react";
import ReactPlayer from "react-player";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../../../../context/AuthContext";
// import "./hero.css";

const HeroSection = () => {
  const [popup, setPopup] = useState(false);

  const openPopup = () => {
    setPopup(true);
    const iframe = document.getElementById("youtube-video");
    if (iframe) {
      iframe.src =
        "https://www.youtube.com/embed/8Kp0w_xU7Gw?si=JcYlKNO_vebL__ED";
    }
  };

  const { user } = useAuth();

  const closePopup = () => {
    setPopup(false);
    const iframe = document.getElementById("youtube-video");
    if (iframe) {
      iframe.src = "";
    }
  };

  return (
    <>
      <div
        className="zubuz-hero-section white-bg"
        style={{ backgroundImage: "url(/images/v1/hero-shape1.png)" }}
      >
        <div className="container">
          <div className="zubuz-hero-content center position-relative">
            <h1>Build your financial model under 5' with AI</h1>
            <p>
              Our platform is designed to help individuals &amp; businesses
              manage their financial plans and reports. It serves various
              purposes related to personal and business finance.
            </p>
            <div className="zubuz-hero-btn-wrap center">
              {!user && (
                <Link className="zubuz-default-btn" to="/sign-in">
                  <span>Start Your Free Trial</span>
                </Link>
              )}
              <button
                className="video-init zubuz-hero-video !flex items-center"
                onClick={openPopup}
              >
                <img
                  style={{ width: "30px", height: "30px" }}
                  src="/images/v1/play-btn.svg"
                  alt
                />
                Watch A Demo
              </button>
            </div>
            <div className="zubuz-hero-shape">
              <img src="/images/v1/shape.png" alt />
            </div>
          </div>
          <div className="zubuz-hero-bottom">
            <div className="zubuz-hero-thumb wow fadeInUpX">
              <img
                src="/images/v1/hero-mocup1.png"
                style={{ marginInline: "auto" }}
                alt
              />
            </div>
            <div className="zubuz-hero-card card1 wow zoomIn">
              <img src="/images/v1/h-card1.png" alt />
            </div>
            <div className="zubuz-hero-card card2 wow zoomIn">
              <img src="/images/v1/h-card2.png" alt />
            </div>
            <div className="zubuz-hero-card card3 wow zoomIn">
              <img src="/images/v1/h-card4.png" alt />
            </div>
            <div className="zubuz-hero-card card4 wow zoomIn">
              <img src="/images/v1/h-card3.png" alt />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`popup-video ${popup ? "popup" : "popdown"}`}
        onClick={closePopup}
      >
        <div className="video-wrapper">
          <iframe
            id="youtube-video"
            className="video"
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/8Kp0w_xU7Gw?si=JcYlKNO_vebL__ED"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          <button className="close-button" onClick={closePopup}>
            <IoClose className="close-icon" />
          </button>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
