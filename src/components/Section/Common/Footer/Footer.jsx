/* eslint-disable react/no-unescaped-entities */

import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { useState } from "react";
import { Modal } from "antd";

const policies = [
  {
    title: "Purchasing Service Guide",
    content: (
      <div className="policy-content">
        <h3 className="font-semibold text-2xl mb-6">
          Purchasing Service Guide
        </h3>
        <ol className="my-4 gap-2">
          <li>
            1. Select the appropriate service package and click "Purchase" and
            fill in the service account registration information with email (if
            you have not registered BeeKrowd)
          </li>
          <li>
            2. Choose a payment method: When paying for BeeKrowd services,
            select the payment method by credit card.
          </li>
          <li>
            3. Enter card information: After selecting to pay by credit card,
            you will be redirected to a third-party payment page. Here you need
            to enter all your credit card information (card number, cardholder
            name, expiration date, CVV/CVC code, etc.)
          </li>
          <li>4. Confirm payment.</li>
          <li>
            5. Complete payment: If the payment is successful, you will receive
            a confirmation notice from BeeKrowd and the third-party payment
            service provider.
          </li>
        </ol>
        <h4 className="font-medium">Advantages of credit card payment:</h4>
        <ul className="my-4">
          <li>
            Fast and convenient: Payment by credit card only takes a few minutes
            to complete.
          </li>
          <li>
            Safe: BeeKrowd cooperates with reputable third parties to ensure the
            safety of your transactions.
          </li>
          <li>
            Secure: Your credit card information is absolutely confidential and
            not publicly disclosed.
          </li>
        </ul>
        <p>
          The listed service price on the Website includes taxes as per current
          legal regulations and other costs related to purchasing the service,
          excluding additional costs confirmed through BeeKrowd's Hotline or
          Email and accepted by the customer during the service delivery
          confirmation process.
        </p>
      </div>
    ),
  },
  {
    title: "General Policies and Regulations",
    content: (
      <div>
        <h3 className="font-semibold text-2xl mb-6">
          GENERAL POLICIES AND REGULATIONS
        </h3>
        <h4 className="font-semibold text-lg my-6">1. General Principles</h4>
        <ol>
          <li>
            The e-commerce website beekrowd.com is owned by BeeKrowd. Partners
            on the beekrowd.com website are individuals, organizations, hotels,
            and companies inside and outside the country that purchase services
            from BeeKrowd.
          </li>
          <li>
            Individuals, organizations, and companies inside and outside the
            country when purchasing services are allowed to negotiate on the
            basis of respecting the legal rights and interests of the parties
            involved in service purchase and sale activities through
            registration forms or service contracts in accordance with the laws
            of the Socialist Republic of Vietnam.
          </li>
          <li>
            Individuals, organizations, and companies purchasing services must
            comply with all relevant legal regulations and not belong to
            prohibited business or advertising cases according to the law.
          </li>
        </ol>
        <h2 className="font-semibold text-lg my-6">2. General Regulations</h2>
        <ol>
          <li>
            Customers when accessing our website at beekrowd.com are required to
            read and understand the regulations and policies published on the
            website, including "Service Purchase Guide," "Delivery and Warranty
            Policy," and "Privacy Terms."
          </li>
          <li>
            BeeKrowd has the right to change, modify, add or remove any part of
            its website at any time. These changes will take effect immediately
            upon being posted on the website without prior notice. Customers are
            responsible for regularly checking and updating information on the
            website.
          </li>
          <li>
            BeeKrowd is not responsible for the quality of the Internet
            connection that may affect the access speed of customers to the
            beekrowd.com website.
          </li>
          <li>
            Customers must ensure they are 18 years old when accessing the
            website and conducting transactions according to the law.
          </li>
          <li>
            Customers are responsible for keeping their account password and
            activities on the beekrowd.com website confidential. In case of
            unauthorized account access, customers need to immediately notify
            BeeKrowd. We are not responsible for damages or losses arising from
            unauthorized transactions conducted with the customer's account.
          </li>
          <li>
            If false information is detected from the customer's account on the
            website, we will immediately lock the account and/or take other
            measures according to the law.
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: "Privacy Terms",
    content: (
      <div>
        <h3 className="font-semibold text-2xl mb-6">PRIVACY TERMS</h3>
        <h4 className="font-semibold text-lg my-6">
          1. Purpose, scope of use, and storage time of information
        </h4>
        <h5 className="font-semibold text-base my-4">
          1.1 Purpose, scope of information use
        </h5>
        <p>
          Provide service: BeeKrowd uses your information to manage, operate,
          review, and/or process your transactions with us or with third parties
          through intermediary service units.
        </p>
        <p>
          Customer support: BeeKrowd uses your information to solve or
          facilitate customer service, timely support according to your
          requests.
        </p>
        <p>
          Verification and identification: BeeKrowd uses your information for
          legal verification, evaluation, or identification of customers.
        </p>
        <p>
          Research and development: BeeKrowd uses your information for
          statistical research to maintain internal records or for the purpose
          of developing and improving customer service quality.
        </p>
        <p>
          Compliance with the law: BeeKrowd uses your information to meet legal
          procedures or requests from competent state agencies when required,
          and the disclosure of information is necessary according to the law.
        </p>
        <p>
          Other purposes: BeeKrowd may collect, use, process your personal data
          depending on the specific circumstances not listed above. However,
          BeeKrowd will notify you of this purpose at the time we request your
          permission unless permitted by law.
        </p>
        <h5 className="font-semibold text-base my-4">
          1.2 Individuals or organizations that can access this information
        </h5>
        <p>
          BeeKrowd employees: BeeKrowd only allows its employees to access your
          personal information when necessary to perform their job duties.
        </p>
        <p>
          BeeKrowd partners: BeeKrowd may share your personal information with
          our partners, such as intermediary service units like transportation
          services, intermediary payment services, or court orders or any
          competent state agencies to (i) comply with legal regulations; (ii)
          enforce obligations under contract/transaction terms; (iii) meet your
          customer service requests; (iv) protect our rights, property, or
          safety and yours.
        </p>
        <p>
          Competent state agencies: BeeKrowd will provide your personal
          information to competent state agencies when requested according to
          legal regulations.
        </p>
        <h5 className="font-semibold text-base my-4">
          1.3 We may collect your personal data when:
        </h5>
        <p>
          You register an account on our website: BeeKrowd collects basic
          personal information such as name, email address, phone number to
          create an account for you.
        </p>
        <p>
          You interact with us: BeeKrowd collects personal information when you
          perform actions such as:
        </p>
        <ul className="ml-2">
          <li>- Calling BeeKrowd's hotline (may be recorded)</li>
          <li>- Sending email to BeeKrowd</li>
          <li>- Using BeeKrowd's social media applications</li>
          <li>- Sending letters to BeeKrowd</li>
          <li>- Directly meeting with BeeKrowd staff</li>
          <li>- Providing feedback or complaints to BeeKrowd</li>
        </ul>
        <p>
          You link your BeeKrowd account with other accounts: BeeKrowd may
          collect personal information from social media accounts or other
          external accounts linked to your BeeKrowd account.
        </p>
        <p>
          You use BeeKrowd's social media features: BeeKrowd may collect
          personal information when you use BeeKrowd's social media features
          according to the policies of the social media service provider.
        </p>
        <p>You provide feedback or complaints to us</p>
        <p>
          The above cases do not aim to fully list all cases but only provide
          some common cases when your personal data may be collected.
        </p>
        <h5 className="font-semibold text-base my-4">
          1.4 Data collection scope
        </h5>
        <p>
          a. The types of personal data we may collect include: name, email
          address, delivery and/or billing address, bank account information and
          payment information, phone number, images, sound, and other
          information about the user when you log in to use linked services on
          our website or any information we have requested and you have
          permitted to provide.
        </p>
        <p>
          b. If you do not want us to collect personal information/data as
          stated, you have the right not to provide information or withdraw
          permission by notifying us in writing or via email. However, refusal
          or cancellation of permission for us to collect, use, or process your
          personal data may affect your transactions with us and/or limit your
          use of linked services on the website.
        </p>
        <p>
          c. We do not intentionally collect personal information from
          individuals under 18 years old without parental or legal guardian
          supervision. If you are under 18 years old, please do not provide us
          with any personal information. If we discover that the personal
          information of a user under 18 years old has been provided without
          guardian supervision, we will delete this information from our data
          without prior notice.
        </p>
        <h5 className="font-semibold text-base my-4">
          1.5 Storage time and security commitments:
        </h5>
        <p>
          a. We apply appropriate security measures to protect your personal
          data on our management systems. Your personal data will be stored on
          secure networks and can only be accessed by a limited number of
          employees with special access rights. However, we cannot guarantee
          absolute security due to unexpected incidents. In case of an incident,
          we will do our best to remedy and minimize the risk.
        </p>
        <p>
          b. We commit to maintaining your personal data in accordance with
          legal regulations. If necessary and within the scope of the law, we
          may securely destroy your personal data without prior notice.
        </p>
        <h4 className="font-semibold text-lg my-6">
          2. Intellectual Property Rights
        </h4>
        <p>
          All intellectual property rights (including registered or unregistered
          products) such as content, information, design, text, graphics,
          software, images, videos, music, sound, software translation, source
          code, and basic software are our property. All content of the website
          is protected by Vietnamese law and international conventions.
        </p>
        <h4 className="font-semibold text-lg my-6">
          3. Information modification and account deletion policy
        </h4>
        <p>
          a. You can change personal information on the registered account by
          logging in and editing on the beekrowd.com website or contacting us
          via email or BeeKrowd's hotline for support.
        </p>
        <p>
          b. To delete the account and cancel all personal information and
          purchase history on the website, please contact us via email:
          support@beekrowd.com
        </p>
        <h4 className="font-semibold text-lg my-6">4. Changes to the policy</h4>
        <p>
          This privacy policy may be adjusted to suit BeeKrowd's and customers'
          needs and comply with legal regulations without prior notice (if any).
        </p>
        <h4 className="font-semibold text-lg my-6">
          5. Information collection and management unit
        </h4>
        <p>BeeKrowd Joint Stock Company</p>
        <p>
          Head office: Dreamplex 21 Nguyen Trung Ngan, Ben Nghe Ward, District
          1, Ho Chi Minh City.
        </p>
        <p>
          If you have any questions or complaints about customer information
          privacy regulations or find your personal information being misused,
          please contact us through the following channels for answers and
          support:
        </p>
        <p>Website: https://www.beekrowd.com</p>
        <p>Hotline: +84 376.372.727</p>
        <p>Email: support@beekrowd.com</p>
      </div>
    ),
  },
  {
    title: "Delivery and Warranty Policy",
    content: (
      <div>
        <h3 className="font-semibold text-2xl mb-6">
          DELIVERY AND WARRANTY POLICY
        </h3>

        <ol>
          <li>
            <h6 className="my-4">
              1. If the service registration is successful but not usable within
              3 days, please contact us via phone, email, website for a
              resolution or refund within 15 working days.
            </h6>
          </li>
          <li>
            <h6 className="my-4">
              2. We commit to using all measures to secure customer documents
              and images collected and only use them for storage, complaint
              resolution, customer support, or legitimate and necessary purposes
              without using them for commercial or other personal gain purposes.
            </h6>
          </li>
          <li>
            <h6 className="my-4">
              3. BeeKrowd only warrants services when the error is on our side,
              such as:
            </h6>
            <ul className="ml-2">
              <li>- The service is not provided as committed.</li>
              <li>
                - The service is suspended or terminated due to BeeKrowd's
                error.
              </li>
            </ul>
            <p className="mt-2">
              We will contact you to guide you on the return or warranty
              procedure. Note that we only support service exchanges and returns
              within 3 days from the date you receive the service. The
              processing time for returns and warranties is a maximum of 11 days
              from the date of receiving your request.
            </p>
          </li>
          <li className="mt-2">
            <p> BeeKrowd will not warrant in the following cases:</p>
            <ul className="ml-2">
              <li>- Using our services for improper purposes.</li>
              <li>
                - The service faces some risks due to third-party software or
                hardware..
              </li>
            </ul>
          </li>
          <li>
            <h6 className="my-4">
              4. All information regarding changes or cancellations of service
              packages can be self-changed or canceled, or you can notify us for
              timely support.
            </h6>
          </li>
          <li>
            <h6 className="my-4">
              5. To check all information related to BeeKrowd's services, please
              text on the website, send an email, or call the hotline and
              provide your name, phone number, or order code to be checked and
              supported as soon as possible.
            </h6>
          </li>
        </ol>
        <p>
          If you have any questions or complaints about customer information
          privacy regulations or find your personal information being misused,
          please contact us through the following channels for answers and
          support:
        </p>
        <p>Website: https://www.beekrowd.com</p>
        <p>Hotline: +84 376.372.727</p>
        <p>Email: support@beekrowd.com</p>
      </div>
    ),
  },
];

const Footer = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const showModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalContent("");
  };

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
                    <Link to="/https://beekrowd.canny.io/beekrowd-feedback">
                      Feedback
                    </Link>
                  </li>
                  <li>
                    <Link to="/https://beekrowd.gitbook.io/beekrowd-financial-model-guide">
                      Guide
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact-us">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-2 col-md-4">
              <div className="zubuz-footer-menu">
                <div className="zubuz-footer-title">
                  <p>POLICIES AND TERMS</p>
                </div>
                <ul className="text-gray-500 dark1:text-gray-400 font-medium">
                  {policies.map((policy, index) => (
                    <li key={index} className="mb-4">
                      <div
                        onClick={() => showModal(policy.content)}
                        className="hover:underline hover:cursor-pointer"
                      >
                        {policy.title}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-md-4">
              <div className="zubuz-footer-menu extar-margin">
                <div className="zubuz-footer-title">
                  <p>CONTACT</p>
                </div>
                <ul>
                  <li>BeeKrowd Joint Stock Company</li>
                  <li>
                    Head office: Dreamplex 21 Nguyen Trung Ngan, Ben Nghe Ward,
                    District 1, Ho Chi Minh City.
                  </li>
                  <li>
                    <Link to="/tel:+84376372727">Hotline: +84 376.372.727</Link>
                  </li>
                  <li>
                    <Link to="/https://www.beekrowd.com/">
                      Website: beekrowd.com
                    </Link>
                  </li>
                  <li>
                    <Link to="/mailto:support@beekrowd.com">
                      Email: support@beekrowd.com
                    </Link>
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
                <a
                  href="https://x.com/BeeKrowd"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/BeeKrowd"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebookF />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/beekrowd/posts/?feedView=all"
                  target="_blank"
                  rel="noreferrer"
                >
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

      <Modal
        width={700}
        // title="Policy Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        // style={{ width: "70%" }} // Adjust the width as needed
        centered
      >
        <div>{modalContent}</div>
      </Modal>
    </footer>
  );
};

export default Footer;
