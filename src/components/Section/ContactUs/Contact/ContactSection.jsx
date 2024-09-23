import { Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaLinkedin, FaGithub } from "react-icons/fa";

const ContactSection = () => {
  return (
    <div className="section zubuz-section-padding2 white-bg">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="zubuz-default-content m-right">
              <h2>Contact our support team</h2>
              <p>
                Book an appointment with our team now! If you have any questions
                about growing your business, contact our team and schedule a
                call.
              </p>
              <div className="zubuz-extara-mt">
                <div className="zubuz-iconbox-wrap-left d-block">
                  <div className="zubuz-iconbox-data data-small">
                    <span>Office Location:</span>
                    <p>
                      Dreamplex 21 Nguyen Trung Ngan, Ben Nghe Ward, District 1,
                      Ho Chi Minh City
                    </p>
                  </div>
                </div>
                <div className="zubuz-iconbox-wrap-left d-block">
                  <div className="zubuz-iconbox-data data-small">
                    <span>Social Media:</span>
                    <div className="zubuz-social-icon social-box">
                      <ul>
                        <li>
                          <Link to="https://x.com/BeeKrowd" target="_blank">
                            <FaTwitter />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="https://facebook.com/BeeKrowd"
                            target="_blank"
                          >
                            <FaFacebookF />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="https://www.linkedin.com/company/beekrowd/posts/?feedView=all"
                            target="_blank"
                          >
                            <FaLinkedin />
                          </Link>
                        </li>
                        {/* <li>
                          <Link to="/https://github.com/">
                            <FaGithub />
                          </Link>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="zubuz-form-wrap">
              <h3>Fill the from below</h3>
              <form action="#">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="zubuz-main-form">
                      <input type="text" placeholder="Your Name*" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="zubuz-main-form">
                      <input type="email" placeholder="Email Address*" />
                    </div>
                  </div>
                </div>
                <div className="zubuz-main-form">
                  <input type="text" placeholder="Subject" />
                </div>
                <div className="zubuz-main-form">
                  <textarea
                    name="textarea"
                    placeholder="Write us your comment"
                  ></textarea>
                </div>
                <button id="zubuz-submit-btn" type="button">
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
