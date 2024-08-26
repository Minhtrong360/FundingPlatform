/* eslint-disable react/no-unescaped-entities */

import {Link} from "react-router-dom";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="zubuz-footer-section main-footer white-bg">
      <div className="container">
        <div className="zubuz-footer-top">
          <div className="row">
            <div className="col-xl-4 col-lg-12">
              <div className="zubuz-footer-textarea">
                <Link to="">
                  <img src="/images/logo/logo-dark.svg" alt="" />
                </Link>
                <p>
                  We're your innovation partner, delivering cutting-edge
                  solutions that elevate your business to the next level.
                </p>
                <div className="zubuz-subscribe-one">
                  <form>
                    <input type="email" placeholder="Email Address" />
                    <button
                      className="zubuz-default-btn zubuz-subscription-btn one"
                      id="zubuz-subscription-btn"
                      type="submit"
                    >
                      <span>Subscribe</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-4">
              <div className="zubuz-footer-menu extar-margin">
                <div className="zubuz-footer-title">
                  <p>ABOUT US</p>
                </div>
                <ul>
                  <li>
                    <Link to="/about-us">About</Link>
                  </li>
                  <li>
                    <Link to="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link to="https://beekrowd.canny.io/beekrowd-feedback">Feedback</Link>
                  </li>
                  <li>
                    <Link to="https://beekrowd.gitbook.io/beekrowd-financial-model-guide">Guide</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-2 col-md-4">
              <div className="zubuz-footer-menu">
                <div className="zubuz-footer-title">
                  <p>POLICIES AND TERMS</p>
                </div>
                <ul>
                  <li>
                    <Link to="">Purchasing Service Guide</Link>
                  </li>
                  <li>
                    <Link to="">General Policies and Regulations</Link>
                  </li>
                  <li>
                    <Link to="">Privacy Terms</Link>
                  </li>
                  <li>
                    <Link to="">Delivery and Warranty Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-md-4">
              <div className="zubuz-footer-menu extar-margin">
                <div className="zubuz-footer-title">
                  <p>CONTACT</p>
                </div>
                <ul>
                  <li>
                    BeeKrowd Joint Stock Company
                  </li>
                  <li>
                    Head office: Dreamplex 21 Nguyen Trung Ngan, Ben Nghe Ward, District 1, Ho Chi Minh City.
                  </li>
                  <li>
                    <Link to="tel:+84376372727">Hotline: +84 376.372.727</Link>
                  </li>
                  <li>
                    <Link to="https://www.beekrowd.com/">Website: beekrowd.com</Link>
                  </li>
                  <li>
                    <Link to="mailto:support@beekrowd.com">Email: support@beekrowd.com</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="zubuz-footer-bottom">
          <div className="zubuz-social-icon order-md-2">
            <ul>
              <li>
                <a href="https://x.com/BeeKrowd" target="_blank" rel="noreferrer">
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a href="https://facebook.com/BeeKrowd" target="_blank" rel="noreferrer">
                  <FaFacebookF />
                </a>
              </li>
              <li>
                  <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                    <FaInstagram />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/beekrowd/posts/?feedView=all" target="_blank" rel="noreferrer">
                    <FaLinkedin />
                  </a>
                </li>
                <li>
                  <a href="https://github.com/" target="_blank" rel="noreferrer">
                    <FaGithub />
                  </a>
                </li>
              </ul>
            </div>
            <div className="zubuz-copywright">
              <p> &copy;Copyright 2024, All Rights Reserved by BeeKrowd</p>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;
