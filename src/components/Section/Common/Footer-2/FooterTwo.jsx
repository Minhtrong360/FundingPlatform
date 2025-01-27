/* eslint-disable react/no-unescaped-entities */

import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const FooterTwo = () => {
  return (
    <footer className="zubuz-footer-section">
      <div className="container">
        <div className="zubuz-footer-top">
          <div className="row">
            <div className="col-xl-4 col-lg-12">
              <div className="zubuz-footer-textarea">
                <Link to="/">
                  <img src="/images/logo/EcoBee.svg" alt="" />
                </Link>
                <p>
                  We're your innovation partner, delivering cutting-edge
                  solutions that elevate your business to the next level.
                </p>
                <div className="zubuz-social-icon social-box">
                  <ul>
                    <li>
                      <a href="https://twitter.com/" target="_blank">
                        <FaTwitter />
                      </a>
                    </li>
                    <li>
                      <a href="https://facebook.com/" target="_blank">
                        <FaFacebookF />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/" target="_blank">
                        <FaLinkedin />
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/" target="_blank">
                        <FaGithub />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-4">
              <div className="zubuz-footer-menu extar-margin">
                <div className="zubuz-footer-title">
                  <p>Navigation</p>
                </div>
                <ul>
                  <li>
                    <Link to="">Demos</Link>
                  </li>
                  <li>
                    <Link to="">About Us</Link>
                  </li>
                  <li>
                    <Link to="">Services</Link>
                  </li>
                  <li>
                    <Link to="">Pages</Link>
                  </li>
                  <li>
                    <Link to="">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-2 col-md-4">
              <div className="zubuz-footer-menu">
                <div className="zubuz-footer-title">
                  <p>Utility pages</p>
                </div>
                <ul>
                  <li>
                    <Link to="">Instructions</Link>
                  </li>
                  <li>
                    <Link to="">Style guide</Link>
                  </li>
                  <li>
                    <Link to="">Licenses</Link>
                  </li>
                  <li>
                    <Link to="">404 Not found</Link>
                  </li>
                  <li>
                    <Link to="">Password protected</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-md-4">
              <div className="zubuz-footer-menu extar-margin">
                <div className="zubuz-footer-title">
                  <p>Resources</p>
                </div>
                <ul>
                  <li>
                    <Link to="">Support</Link>
                  </li>
                  <li>
                    <Link to="">Privacy policy</Link>
                  </li>
                  <li>
                    <Link to="">Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link to="">Strategic finance</Link>
                  </li>
                  <li>
                    <Link to="">Video guide</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="zubuz-footer-bottom center">
          <div className="zubuz-copywright">
            <p> &copy;Copyright 2024, All Rights Reserved by BeeKrowd</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterTwo;
