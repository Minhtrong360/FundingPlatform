/* eslint-disable react/no-unescaped-entities */

import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const FooterSectionThree = () => {
  return (
    <footer className="zubuz-footer-section dark-bg">
      <div className="container">
        <div className="zubuz-footer-extra-top">
          <div className="row">
            <div className="col-lg-7">
              <div className="zubuz-footer-extra-title">
                <h2>Accelerate your startup’s growth journey.</h2>
              </div>
            </div>
            <div className="col-lg-5 d-flex align-items-center">
              <div className="zubuz-footer-btn">
                <Link className="zubuz-default-btn pill" to="/contact-us">
                  <span>Get started now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="zubuz-footer-top">
          <div className="row">
            <div className="col-xl-4 col-lg-12">
              <div className="zubuz-footer-textarea light">
                <Link to="/">
                  <img src="/images/logo/logo-white.svg" alt="" />
                </Link>
                <p>
                  We're your innovation partner, delivering cutting-edge
                  solutions that elevate your business to the next level.
                </p>
                <div className="zubuz-social-icon social-box social-box-white">
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
              <div className="zubuz-footer-menu light extar-margin">
                <div className="zubuz-footer-title light">
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
              <div className="zubuz-footer-menu light">
                <div className="zubuz-footer-title light">
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
              <div className="zubuz-footer-menu light info extar-margin">
                <div className="zubuz-footer-title light">
                  <p>Contact us</p>
                </div>
                <ul>
                  <li>
                    <Link to="">
                      <img src="/images/icon/call.svg" alt="" />
                      +088-234-6849
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <img src="/images/icon/email.svg" alt="" />
                      example@gmail.com
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <img src="/images/icon/map.svg" alt="" />
                      Howard Street, 13125 USA
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="zubuz-footer-bottom center light">
          <div className="zubuz-copywright light">
            <p> &copy;Copyright 2024, All Rights Reserved by BeeKrowd</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSectionThree;
