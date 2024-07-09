import React, { useEffect, useState } from "react";

import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "../UserProfile/NewUserPage";
import NavbarItem from "./NavbarItem";
import { Modal } from "antd";

// function Footer() {
//   return (
//     <footer className="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
//       <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5 text-center">
//         <div>
//           <a
//             className="font-semibold text-2xl text-blue-600 flex items-center sm:justify-start justify-center space-x-3 rtl:space-x-reverse hover:cursor-pointer"
//             href="/"
//             aria-label="Brand"
//           >
//             BeeKrowd
//           </a>
//         </div>
//         <ul className="text-center">
//           <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 darkBeforeTextGray">
//             <a
//               className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 darkTextGray darkHoverTextWhite darkFocusOutlineNone darkFocusRing-1 darkFocus"
//               href="/FAQ"
//             >
//               About
//             </a>
//           </li>
//           <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 darkBeforeTextGray">
//             <NavbarItem
//               href="https://beekrowd.gitbook.io/beekrowd-financial-model-guide"
//               target="_blank"
//             >
//               Documentation
//             </NavbarItem>
//           </li>
//           <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 darkBeforeTextGray">
//             <NavbarItem
//               href="https://beekrowd.canny.io/beekrowd-feedback"
//               target="_blank"
//             >
//               Feedback
//             </NavbarItem>
//           </li>
//           <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 darkBeforeTextGray">
//             <a
//               className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 darkTextGray darkHoverTextWhite darkFocusOutlineNone darkFocusRing-1 darkFocus"
//               href="/news"
//             >
//               Blog
//             </a>
//           </li>
//         </ul>
//         <div className="md:text-end space-x-2">
//           <a
//             className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent 8 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkTextGray darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
//             href="https://www.facebook.com/BeeKrowd"
//           >
//             <FacebookIcon />
//           </a>
//           <a
//             className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent 8 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkTextGray darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
//             href="https://twitter.com/BeeKrowd"
//           >
//             <TwitterIcon />
//           </a>
//           <a
//             className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent 8 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkTextGray darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
//             href="https://vn.linkedin.com/company/beekrowd"
//           >
//             <LinkedinIcon />
//           </a>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;

const PolicyModal = ({ isVisible, content, onClose }) => {
  return (
    <Modal
      width={1000}
      // title="Policy Details"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      style={{ width: "100%" }} // Adjust the width as needed
      centered
    >
      <div>{content}</div>
    </Modal>
  );
};
function Footer() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const googleTranslateElementInit = () => {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    }
  };

  const policies = [
    {
      title: "Purchasing Service Guide",
      content: (
        <div>
          <h1 className="font-medium">Purchasing Service Guide</h1>
          <ol>
            <li>
              Select the appropriate service package and click "Purchase" and
              fill in the service account registration information with email
              (if you have not registered BeeKrowd)
            </li>
            <li>
              Choose a payment method: When paying for BeeKrowd services, select
              the payment method by credit card.
            </li>
            <li>
              Enter card information: After selecting to pay by credit card, you
              will be redirected to a third-party payment page. Here you need to
              enter all your credit card information (card number, cardholder
              name, expiration date, CVV/CVC code, etc.)
            </li>
            <li>Confirm payment.</li>
            <li>
              Complete payment: If the payment is successful, you will receive a
              confirmation notice from BeeKrowd and the third-party payment
              service provider.
            </li>
          </ol>
          <h1 className="font-medium">Advantages of credit card payment:</h1>
          <ul>
            <li>
              Fast and convenient: Payment by credit card only takes a few
              minutes to complete.
            </li>
            <li>
              Safe: BeeKrowd cooperates with reputable third parties to ensure
              the safety of your transactions.
            </li>
            <li>
              Secure: Your credit card information is absolutely confidential
              and not publicly disclosed.
            </li>
          </ul>
          <p>
            The listed service price on the Website includes taxes as per
            current legal regulations and other costs related to purchasing the
            service, excluding additional costs confirmed through BeeKrowd's
            Hotline or Email and accepted by the customer during the service
            delivery confirmation process.
          </p>
        </div>
      ),
    },
    {
      title: "General Policies and Regulations",
      content: (
        <div>
          <h1 className="font-medium">GENERAL POLICIES AND REGULATIONS</h1>
          <h2 className="font-medium">1. General Principles</h2>
          <ol>
            <li>
              The e-commerce website beekrowd.com is owned by BeeKrowd. Partners
              on the beekrowd.com website are individuals, organizations,
              hotels, and companies inside and outside the country that purchase
              services from BeeKrowd.
            </li>
            <li>
              Individuals, organizations, and companies inside and outside the
              country when purchasing services are allowed to negotiate on the
              basis of respecting the legal rights and interests of the parties
              involved in service purchase and sale activities through
              registration forms or service contracts in accordance with the
              laws of the Socialist Republic of Vietnam.
            </li>
            <li>
              Individuals, organizations, and companies purchasing services must
              comply with all relevant legal regulations and not belong to
              prohibited business or advertising cases according to the law.
            </li>
          </ol>
          <h2 className="font-medium">2. General Regulations</h2>
          <ol>
            <li>
              Customers when accessing our website at beekrowd.com are required
              to read and understand the regulations and policies published on
              the website, including "Service Purchase Guide," "Delivery and
              Warranty Policy," and "Privacy Terms."
            </li>
            <li>
              BeeKrowd has the right to change, modify, add or remove any part
              of its website at any time. These changes will take effect
              immediately upon being posted on the website without prior notice.
              Customers are responsible for regularly checking and updating
              information on the website.
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
              BeeKrowd. We are not responsible for damages or losses arising
              from unauthorized transactions conducted with the customer's
              account.
            </li>
            <li>
              If false information is detected from the customer's account on
              the website, we will immediately lock the account and/or take
              other measures according to the law.
            </li>
          </ol>
        </div>
      ),
    },
    {
      title: "Privacy Terms",
      content: (
        <div>
          <h1 className="font-medium">PRIVACY TERMS</h1>
          <h2 className="font-medium">
            1. Purpose, scope of use, and storage time of information
          </h2>
          <h3 className="font-medium">1.1 Purpose, scope of information use</h3>
          <p>
            Provide service: BeeKrowd uses your information to manage, operate,
            review, and/or process your transactions with us or with third
            parties through intermediary service units.
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
            Compliance with the law: BeeKrowd uses your information to meet
            legal procedures or requests from competent state agencies when
            required, and the disclosure of information is necessary according
            to the law.
          </p>
          <p>
            Other purposes: BeeKrowd may collect, use, process your personal
            data depending on the specific circumstances not listed above.
            However, BeeKrowd will notify you of this purpose at the time we
            request your permission unless permitted by law.
          </p>
          <h3 className="font-medium">
            1.2 Individuals or organizations that can access this information
          </h3>
          <p>
            BeeKrowd employees: BeeKrowd only allows its employees to access
            your personal information when necessary to perform their job
            duties.
          </p>
          <p>
            BeeKrowd partners: BeeKrowd may share your personal information with
            our partners, such as intermediary service units like transportation
            services, intermediary payment services, or court orders or any
            competent state agencies to (i) comply with legal regulations; (ii)
            enforce obligations under contract/transaction terms; (iii) meet
            your customer service requests; (iv) protect our rights, property,
            or safety and yours.
          </p>
          <p>
            Competent state agencies: BeeKrowd will provide your personal
            information to competent state agencies when requested according to
            legal regulations.
          </p>
          <h3 className="font-medium">
            1.3 We may collect your personal data when:
          </h3>
          <p>
            You register an account on our website: BeeKrowd collects basic
            personal information such as name, email address, phone number to
            create an account for you.
          </p>
          <p>
            You interact with us: BeeKrowd collects personal information when
            you perform actions such as:
          </p>
          <ul>
            <li>Calling BeeKrowd's hotline (may be recorded)</li>
            <li>Sending email to BeeKrowd</li>
            <li>Using BeeKrowd's social media applications</li>
            <li>Sending letters to BeeKrowd</li>
            <li>Directly meeting with BeeKrowd staff</li>
            <li>Providing feedback or complaints to BeeKrowd</li>
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
          <h3 className="font-medium">1.4 Data collection scope</h3>
          <p>
            a. The types of personal data we may collect include: name, email
            address, delivery and/or billing address, bank account information
            and payment information, phone number, images, sound, and other
            information about the user when you log in to use linked services on
            our website or any information we have requested and you have
            permitted to provide.
          </p>
          <p>
            b. If you do not want us to collect personal information/data as
            stated, you have the right not to provide information or withdraw
            permission by notifying us in writing or via email. However, refusal
            or cancellation of permission for us to collect, use, or process
            your personal data may affect your transactions with us and/or limit
            your use of linked services on the website.
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
          <h3 className="font-medium">
            1.5 Storage time and security commitments:
          </h3>
          <p>
            a. We apply appropriate security measures to protect your personal
            data on our management systems. Your personal data will be stored on
            secure networks and can only be accessed by a limited number of
            employees with special access rights. However, we cannot guarantee
            absolute security due to unexpected incidents. In case of an
            incident, we will do our best to remedy and minimize the risk.
          </p>
          <p>
            b. We commit to maintaining your personal data in accordance with
            legal regulations. If necessary and within the scope of the law, we
            may securely destroy your personal data without prior notice.
          </p>
          <h2 className="font-medium">2. Intellectual Property Rights</h2>
          <p>
            All intellectual property rights (including registered or
            unregistered products) such as content, information, design, text,
            graphics, software, images, videos, music, sound, software
            translation, source code, and basic software are our property. All
            content of the website is protected by Vietnamese law and
            international conventions.
          </p>
          <h2 className="font-medium">
            3. Information modification and account deletion policy
          </h2>
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
          <h2 className="font-medium">4. Changes to the policy</h2>
          <p>
            This privacy policy may be adjusted to suit BeeKrowd's and
            customers' needs and comply with legal regulations without prior
            notice (if any).
          </p>
          <h2 className="font-medium">
            5. Information collection and management unit
          </h2>
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
          <h1 className="font-semibold">DELIVERY AND WARRANTY POLICY</h1>
          <ol>
            <h2>
              1. If the service registration is successful but not usable within
              3 days, please contact us via phone, email, website for a
              resolution or refund within 15 working days.
            </h2>
            <h2>
              2. We commit to using all measures to secure customer documents
              and images collected and only use them for storage, complaint
              resolution, customer support, or legitimate and necessary purposes
              without using them for commercial or other personal gain purposes.
            </h2>
            <h2>
              3. BeeKrowd only warrants services when the error is on our side,
              such as:
              <ul>
                <li>The service is not provided as committed.</li>
                <li>
                  The service is suspended or terminated due to BeeKrowd's
                  error.
                </li>
              </ul>
              We will contact you to guide you on the return or warranty
              procedure. Note that we only support service exchanges and returns
              within 3 days from the date you receive the service. The
              processing time for returns and warranties is a maximum of 11 days
              from the date of receiving your request.
            </h2>
            <li>
              BeeKrowd will not warrant in the following cases:
              <ul>
                <li>Using our services for improper purposes.</li>
                <li>
                  The service faces some risks due to third-party software or
                  hardware.
                </li>
              </ul>
            </li>
            <h4>
              4. All information regarding changes or cancellations of service
              packages can be self-changed or canceled, or you can notify us for
              timely support.
            </h4>
            <h4>
              5. To check all information related to BeeKrowd's services, please
              text on the website, send an email, or call the hotline and
              provide your name, phone number, or order code to be checked and
              supported as soon as possible.
            </h4>
          </ol>
        </div>
      ),
    },
  ];

  const Vipolicies = [
    {
      title: "Purchasing Service Guide",
      content: (
        <div>
          <h3 className="font-semibold">HƯỚNG DẪN MUA DỊCH VỤ</h3>
          <ol>
            <li>
              Chọn gói dịch vụ phù hợp và bấm vào “Đặt mua” và điền thông tin
              đăng kí tài khoản mua dịch vụ bằng email (nếu bạn chưa đăng ký
              BeeKrowd)
            </li>
            <li>
              Chọn phương thức thanh toán: Khi thanh toán cho dịch vụ BeeKrowd,
              bạn chọn phương thức thanh toán bằng thẻ tín dụng.
            </li>
            <li>
              Nhập thông tin thẻ: Sau khi chọn thanh toán bằng thẻ tín dụng, bạn
              sẽ được chuyển đến trang thanh toán của bên thứ ba. Tại đây, bạn
              cần nhập đầy đủ thông tin thẻ tín dụng của mình (số thẻ, tên chủ
              thẻ, ngày hết hạn thẻ, mã CVV/CVC…)
            </li>
            <li>Xác nhận thanh toán.</li>
            <li>
              Hoàn tất thanh toán: Nếu thanh toán thành công, bạn sẽ nhận được
              thông báo xác nhận từ BeeKrowd và bên thứ ba cung cấp dịch vụ
              thanh toán.
            </li>
          </ol>
          <h4 className="font-medium">
            Ưu điểm của thanh toán bằng thẻ tín dụng:
          </h4>
          <ul>
            <li>
              Nhanh chóng và tiện lợi: Thanh toán bằng thẻ tín dụng chỉ mất vài
              phút để hoàn tất.
            </li>
            <li>
              An toàn: BeeKrowd hợp tác với bên thứ ba uy tín để đảm bảo an toàn
              cho giao dịch thanh toán của bạn.
            </li>
            <li>
              Bảo mật: Thông tin thẻ tín dụng của bạn được bảo mật tuyệt đối và
              không được cung cấp công khai ra bên ngoài.
            </li>
            <li>
              Hỗ trợ nhiều loại thẻ: BeeKrowd hỗ trợ thanh toán bằng nhiều loại
              thẻ tín dụng phổ biến trên thị trường.
            </li>
          </ul>
          <p>
            Giá dịch vụ niêm yết tại Website là giá đã bao gồm thuế theo quy
            định pháp luật hiện hành và các chi phí khác liên quan đến việc mua
            dịch vụ trừ các chi phí phát sinh khác được xác nhận qua Hotline
            hoặc Email của BeeKrowd và được sự chấp thuận của khách hàng trong
            quá trình xác nhận, giao nhận dịch vụ.
          </p>
        </div>
      ),
    },
    {
      title: "General Policies and Regulations",
      content: (
        <div>
          <h3 className="font-semibold">CHÍNH SÁCH VÀ QUY ĐỊNH CHUNG</h3>
          <h4 className="font-medium">1. Nguyên tắc chung</h4>
          <ol>
            <li>
              Website thương mại điện tử beekrowd.com do công ty BeeKrowd sở
              hữu. Các đối tác trên website beekrowd.com là các cá nhân, tổ
              chức, nhà, khách sạn, công ty… trong và ngoài nước mua dịch vụ từ
              BeeKrowd.
            </li>
            <li>
              Các cá nhân, tổ chức, công ty… trong và ngoài nước khi mua dịch vụ
              được phép thỏa thuận trên cơ sở tôn trọng quyền và lợi ích hợp
              pháp của các bên tham gia hoạt động mua bán dịch vụ, thông qua
              phiếu đăng kí hoặc hợp đồng dịch vụ không trái với quy định của
              pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam.
            </li>
            <li>
              Các cá nhân, tổ chức, công ty… mua dịch vụ phải đáp ứng đầy đủ các
              quy định của pháp luật có liên quan, không thuộc các trường hợp
              cấm kinh doanh, cấm quảng cáo theo quy định của pháp luật.
            </li>
          </ol>
          <h4 className="font-medium">2. Quy định chung</h4>
          <ol>
            <li>
              Quý khách hàng khi truy cập vào website của chúng tôi tại
              beekrowd.com được yêu cầu đọc kỹ và hiểu rõ các quy định và chính
              sách được công bố trên trang web, bao gồm "Hướng dẫn mua dịch vụ",
              "Chính sách giao nhận và bảo hành", và "Điều khoản bảo mật".
            </li>
            <li>
              BeeKrowd có quyền thay đổi, sửa đổi, thêm mới hoặc loại bỏ bất kỳ
              phần nào trên website của mình vào bất kỳ thời điểm nào. Các thay
              đổi này sẽ có hiệu lực ngay khi được đăng tải lên trang web, mà
              không cần thông báo trước. Quý khách hàng có trách nhiệm thường
              xuyên kiểm tra và cập nhật các thông tin trên website.
            </li>
            <li>
              BeeKrowd không chịu trách nhiệm đối với chất lượng đường truyền
              Internet có thể ảnh hưởng đến tốc độ truy cập của quý khách hàng
              vào website beekrowd.com.
            </li>
            <li>
              Quý khách hàng phải đảm bảo đã đủ 18 tuổi khi truy cập website và
              thực hiện các giao dịch mua bán hàng hóa theo quy định của pháp
              luật.
            </li>
            <li>
              Quý khách hàng chịu trách nhiệm bảo mật mật khẩu, tài khoản và các
              hoạt động của mình trên website beekrowd.com. Trong trường hợp tài
              khoản bị truy cập trái phép, quý khách hàng cần thông báo ngay cho
              BeeKrowd. Chúng tôi không chịu trách nhiệm về các thiệt hại hay
              mất mát phát sinh từ các giao dịch được thực hiện trái phép bằng
              tài khoản của quý khách hàng.
            </li>
            <li>
              Nếu phát hiện thông tin giả mạo từ tài khoản của quý khách hàng
              trên website, chúng tôi sẽ ngay lập tức khóa tài khoản và/hoặc
              thực hiện các biện pháp khác theo quy định của pháp luật.
            </li>
          </ol>
        </div>
      ),
    },
    {
      title: "Privacy Terms",
      content: (
        <div>
          <h3 className="font-semibold">ĐIỀU KHOẢN BẢO MẬT</h3>
          <h4 className="font-medium">
            1. Mục đích, phạm vi sử dụng và thời gian lưu trữ thông tin
          </h4>
          <h5 className="font-medium">
            1.1 Mục đích, phạm vi sử dụng thông tin
          </h5>
          <p>
            Cung cấp dịch vụ: BeeKrowd sử dụng thông tin của bạn để quản lý,
            điều hành, xem xét và/hoặc xử lý giao dịch của bạn với chúng tôi
            hoặc với các bên thứ ba thông qua các đơn vị dịch vụ trung gian.
          </p>
          <p>
            Hỗ trợ khách hàng: BeeKrowd sử dụng thông tin của bạn để giải quyết
            hoặc tạo điều kiện thuận lợi cho dịch vụ chăm sóc khách hàng, hỗ trợ
            kịp thời theo các yêu cầu từ bạn.
          </p>
          <p>
            Xác minh và nhận diện: BeeKrowd sử dụng thông tin của bạn để xác
            minh, đánh giá pháp lý hoặc để nhận biết khách hàng.
          </p>
          <p>
            Nghiên cứu và phát triển: BeeKrowd sử dụng thông tin của bạn để lập
            số liệu thống kê, nghiên cứu nhằm duy trì sổ sách nội bộ hoặc nhằm
            mục đích phát triển, nâng cao chất lượng phục vụ khách hàng.
          </p>
          <p>
            Tuân thủ pháp luật: BeeKrowd sử dụng thông tin của bạn để đáp ứng
            các thủ tục pháp lý hoặc các yêu cầu của cơ quan nhà nước có thẩm
            quyền khi được yêu cầu mà việc tiết lộ thông tin là cần thiết, đúng
            với pháp luật.
          </p>
          <p>
            Mục đích khác: BeeKrowd có thể thu thập, sử dụng, xử lý dữ liệu cá
            nhân của bạn phụ thuộc vào từng hoàn cảnh cụ thể mà mục đích đó có
            thể không được liệt kê ở trên. Tuy nhiên, BeeKrowd sẽ thông báo cho
            bạn về mục đích đó tại thời điểm chúng tôi xin sự cho phép của bạn,
            trừ khi được phép theo quy định của pháp luật.
          </p>
          <h5 className="font-medium">
            1.2 Những người hoặc tổ chức có thể được tiếp cận với thông tin đó
          </h5>
          <p>
            Nhân viên BeeKrowd: BeeKrowd chỉ cho phép nhân viên của BeeKrowd
            truy cập vào thông tin cá nhân của bạn khi cần thiết để thực hiện
            chức trách công việc của họ.
          </p>
          <p>
            Đối tác của BeeKrowd: BeeKrowd có thể chia sẻ thông tin cá nhân của
            bạn với các đối tác của chúng tôi là các đơn vị dịch vụ trung gian
            như dịch vụ vận chuyển, dịch vụ thanh toán trung gian hoặc theo lệnh
            của tòa án hay bất kỳ cơ quan nhà nước có thẩm quyền nhằm (i) tuân
            thủ quy định của pháp luật; (ii) thực thi nghĩa vụ theo các điều
            khoản quy định tại hợp đồng/giao dịch; (iii) đáp ứng các yêu cầu của
            bạn về dịch vụ khách hàng; (iv) bảo vệ quyền, tài sản hoặc sự an
            toàn của chúng tôi và của bạn.
          </p>
          <p>
            Cơ quan nhà nước có thẩm quyền: BeeKrowd sẽ cung cấp thông tin cá
            nhân của bạn cho cơ quan nhà nước có thẩm quyền khi được yêu cầu
            theo quy định của pháp luật.
          </p>
          <h5 className="font-medium">
            1.3 Chúng tôi sẽ có thể thu thập dữ liệu cá nhân của bạn khi:
          </h5>
          <p>
            Khi bạn đăng ký tài khoản trên Website của chúng tôi: BeeKrowd thu
            thập thông tin cá nhân cơ bản như họ tên, địa chỉ email, số điện
            thoại để tạo tài khoản cho bạn.
          </p>
          <p>
            Khi bạn tương tác với chúng tôi: BeeKrowd thu thập thông tin cá nhân
            khi bạn thực hiện các hành động sau:
          </p>
          <ul>
            <li>
              Gọi điện thoại đến hotline của BeeKrowd (có thể được ghi âm lại)
            </li>
            <li>Gửi email cho BeeKrowd</li>
            <li>Sử dụng các ứng dụng truyền thông xã hội của BeeKrowd</li>
            <li>Gửi thư từ cho BeeKrowd</li>
            <li>Gặp gỡ trực tiếp với nhân viên BeeKrowd</li>
            <li>Cung cấp phản hồi hoặc khiếu nại cho BeeKrowd</li>
          </ul>
          <p>
            Khi bạn liên kết tài khoản BeeKrowd với các tài khoản khác: BeeKrowd
            có thể thu thập thông tin cá nhân từ các tài khoản mạng xã hội hoặc
            tài khoản bên ngoài khác mà bạn liên kết với tài khoản BeeKrowd.
          </p>
          <p>
            Khi bạn sử dụng các tính năng mạng xã hội: BeeKrowd có thể thu thập
            thông tin cá nhân khi bạn sử dụng các tính năng mạng xã hội của
            BeeKrowd, tuân theo các chính sách của nhà cung cấp dịch vụ mạng xã
            hội.
          </p>
          <p>
            Khi bạn cung cấp ý kiến phản hồi hoặc gửi khiếu nại cho chúng tôi.
          </p>
          <p>
            Các trường hợp trên không nhằm mục đích liệt kê đầy đủ các trường
            hợp mà chỉ đưa ra một số trường hợp phổ biến về thời điểm dữ liệu cá
            nhân của bạn có thể bị thu thập.
          </p>
          <h5 className="font-medium">1.4 Phạm vi thu thập dữ liệu</h5>
          <p>
            a. Các loại dữ liệu cá nhân mà chúng tôi có thể thu thập bao gồm: họ
            tên, địa chỉ email, địa chỉ giao nhận hàng hóa và/hoặc thanh toán,
            tài khoản ngân hàng và thông tin thanh toán, số điện thoại, hình
            ảnh, âm thanh, và các thông tin khác về người dùng khi bạn đăng nhập
            để sử dụng các dịch vụ liên kết chính thống tại Website của chúng
            tôi hoặc bất kỳ thông tin nào mà chúng tôi đã yêu cầu và được bạn
            cho phép cung cấp.
          </p>
          <p>
            b. Nếu bạn không muốn chúng tôi thu thập thông tin/dữ liệu cá nhân
            như đã nêu, bạn có quyền không cung cấp thông tin hoặc rút lại sự
            cho phép bằng cách thông báo bằng văn bản hoặc qua email đến chúng
            tôi. Tuy nhiên, việc từ chối hoặc hủy bỏ cho phép chúng tôi thu
            thập, sử dụng hoặc xử lý dữ liệu cá nhân của bạn có thể làm ảnh
            hưởng đến giao dịch của bạn với chúng tôi và/hoặc hạn chế việc bạn
            sử dụng các dịch vụ với nền tảng được liên kết tại Website.
          </p>
          <p>
            c. Chúng tôi không cố ý thu thập thông tin cá nhân dưới 18 tuổi mà
            không có sự kiểm soát của cha mẹ hoặc người giám hộ hợp pháp. Nếu
            bạn dưới 18 tuổi, xin vui lòng không cung cấp cho chúng tôi bất kỳ
            thông tin cá nhân nào. Nếu chúng tôi phát hiện thông tin cá nhân của
            người dùng dưới 18 tuổi đã được cung cấp mà không có sự kiểm soát
            của người giám hộ, chúng tôi sẽ xóa thông tin này khỏi dữ liệu của
            chúng tôi mà không cần thông báo trước.
          </p>
          <h5 className="font-medium">
            1.5 Thời gian lưu trữ và cam kết bảo mật:
          </h5>
          <p>
            a. Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ dữ liệu
            cá nhân của bạn trên các hệ thống quản lý của chúng tôi. Dữ liệu cá
            nhân của bạn sẽ được lưu trữ trên các mạng bảo mật và chỉ có thể
            truy cập bởi một số nhân viên được cấp quyền truy cập đặc biệt. Tuy
            nhiên, chúng tôi không thể cam kết an ninh tuyệt đối do sự xuất hiện
            của các sự cố bất ngờ. Trong trường hợp có sự cố xảy ra, chúng tôi
            sẽ nỗ lực hết mình để khắc phục và giảm thiểu rủi ro.
          </p>
          <p>
            b. Chúng tôi cam kết duy trì dữ liệu cá nhân của bạn đúng theo quy
            định pháp luật. Nếu cần thiết và theo phạm vi cho phép của pháp
            luật, chúng tôi có thể tiến hành tiêu hủy dữ liệu cá nhân của bạn
            một cách an toàn mà không cần thông báo trước.
          </p>
          <h4 className="font-medium">2. Thương hiệu bản quyền</h4>
          <p>
            Mọi quyền sở hữu trí tuệ (bao gồm cả những thành phẩm đã đăng ký
            hoặc chưa đăng ký) như nội dung thông tin, thiết kế, văn bản, đồ
            họa, phần mềm, hình ảnh, video, âm nhạc, âm thanh, biên dịch phần
            mềm, mã nguồn và phần mềm cơ bản là tài sản của chúng tôi. Toàn bộ
            nội dung của trang web được bảo vệ bởi luật pháp Việt Nam và các
            công ước quốc tế.
          </p>
          <h4 className="font-medium">
            3. Quy định sửa đổi thông tin và xoá tài khoản
          </h4>
          <p>
            a. Quý khách có thể tự thay đổi thông tin cá nhân trên tài khoản đã
            đăng ký bằng cách đăng nhập và chỉnh sửa trên website beekrowd.com
            hoặc liên hệ với chúng tôi qua email hoặc số hotline của BeeKrowd để
            được hỗ trợ.
          </p>
          <p>
            b. Để xoá tài khoản và hủy bỏ toàn bộ thông tin cá nhân và lịch sử
            mua dịch vụ trên website, quý khách vui lòng liên hệ với chúng tôi
            qua email: support@beekrowd.com
          </p>
          <h4 className="font-medium">4. Thay đổi về chính sách</h4>
          <p>
            Chính sách bảo mật thông tin này có thể được điều chỉnh để phù hợp
            với nhu cầu của BeeKrowd và khách hàng, cũng như tuân thủ các quy
            định pháp luật mà không cần thông báo trước (nếu có).
          </p>
          <h4 className="font-medium">5. Đơn vị thu thập, quản lý thông tin</h4>
          <p>Công Ty Cổ Phần BeeKrowd</p>
          <p>
            Trụ sở chính: Dreamplex, 21 Nguyễn Trung Ngạn, Phường Bến Nghé, Quận
            1, Thành phố Hồ Chí Minh.
          </p>
          <p>
            Nếu quý khách có bất kỳ thắc mắc hoặc khiếu nại nào về các quy định
            bảo mật thông tin khách hàng hoặc phát hiện thông tin cá nhân bị sử
            dụng sai mục đích, vui lòng liên hệ qua các kênh sau để được giải
            đáp và hỗ trợ:
          </p>
          <p>Website: https://www.beekrowd.com</p>
          <p>Hotline: 0376372727</p>
          <p>Email: support@beekrowd.com</p>
        </div>
      ),
    },
    {
      title: "Delivery and Warranty Policy",
      content: (
        <div>
          <h3 className="font-semibold">CHÍNH SÁCH GIAO NHẬN VÀ BẢO HÀNH</h3>
          <ol>
            <li>
              <h4>
                1. Nếu trường hợp việc đăng ký dịch vụ thành công mà không sử
                dụng được trong vòng 3 ngày vui lòng liên hệ chúng tôi qua số
                điện thoại, email, website để có phương án giải quyết hoặc hoàn
                trả các chi phí mà bạn đã thanh toán trong vòng 15 ngày làm
                việc.
              </h4>
            </li>
            <li>
              <h4>
                2. Chúng tôi cam kết dùng mọi biện pháp nhằm bảo mật những chứng
                từ, hình ảnh chúng tôi thu thập của khách hàng và chỉ sử dụng
                cho mục đích lưu trữ, giải quyết khiếu nại, hỗ trợ khách hàng
                hoặc các mục đích được cho là đúng pháp luật và cần thiết mà
                không sử dụng cho mục đích thương mại hay vụ lợi khác.
              </h4>
            </li>
            <li>
              <h4>
                3. BeeKrowd chỉ nhận bảo hành dịch vụ khi lỗi đến từ phía chúng
                tôi như:
              </h4>
              <ul>
                <li>Dịch vụ không được cung cấp đúng theo cam kết.</li>
                <li>Dịch vụ bị tạm ngưng hoặc chấm dứt do lỗi của BeeKrowd.</li>
              </ul>
              <p>
                Chúng tôi sẽ liên lạc với bạn để hướng dẫn quy cách hoàn trả
                hoặc bảo hành. Lưu ý, chúng tôi chỉ hỗ trợ đổi trả dịch vụ với
                điều kiện yêu cầu đổi trả không quá 03 ngày kể từ ngày bạn nhận
                được dịch vụ. Thời gian xử lý hoàn trả, bảo hành được thực hiện
                tối đa trong vòng 14 ngày tính từ ngày nhận được yêu cầu của
                bạn.
              </p>
            </li>
            <li>
              <p>BeeKrowd sẽ không bảo hành cho các trường hợp sau:</p>
              <ul>
                <li>Sử dụng dịch vụ của chúng tôi sai mục đích.</li>
                <li>
                  Dịch vụ bị một số rủi ro do phần mềm hoặc phần cứng của bên
                  thứ ba.
                </li>
              </ul>
            </li>
            <li>
              <h4>
                4. Mọi thông tin về việc thay đổi hay hủy bỏ gói dịch vụ, quý
                khách có thể tự thay đổi hoặc hủy đăng ký dịch vụ hoặc thông báo
                với chúng tôi hỗ trợ thay đổi và hủy cho bạn kịp thời.
              </h4>
            </li>
            <li>
              <h4>
                5. Để kiểm tra mọi thông tin liên quan đến dịch vụ của BeeKrowd
                xin vui lòng nhắn tin vào Website, gửi Email hoặc gọi số Hotline
                và cung cấp tên, số điện thoại hoặc mã đơn hàng để được chúng
                tôi kiểm tra và hỗ trợ sớm nhất.
              </h4>
            </li>
          </ol>
          <p>
            Thông tin liên lạc Quý khách vui lòng liên hệ với chúng tôi trong
            trường hợp có thắc mắc, cần sự hỗ trợ và phản hồi qua các kênh sau:
          </p>
          <p>Website: https://www.beekrowd.com</p>
          <p>Hotline: 0376372727</p>
          <p>Email: support@beekrowd.com</p>
        </div>
      ),
    },
  ];

  const showModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalContent("");
  };

  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    addScript.async = true;
    addScript.defer = true;
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = googleTranslateElementInit;

    addScript.onerror = (error) => {
      console.error(
        "An error occurred while loading the Google Translate script:",
        error
      );
    };

    // MutationObserver to remove href attribute when the element is added to DOM
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const anchorElement = document.querySelector(
            ".VIpgJd-ZVi9od-xl07Ob-lTBxed"
          );
          if (anchorElement) {
            anchorElement.removeAttribute("href");
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.body.removeChild(addScript);
      observer.disconnect();
    };
  }, []);

  return (
    <footer className="bg-gray-200 dark1:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4">
            <div className="mb-6 md:mb-0">
              <a href="https://flowbite.com/" className="flex items-center">
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-blue-600">
                  BEEKROWD
                </span>
              </a>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase ">
                About Us
              </h2>
              <ul className="text-gray-500 dark1:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/FAQ" className="hover:underline">
                    About
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/news" className="hover:underline">
                    Blog
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://beekrowd.canny.io/beekrowd-feedback"
                    className="hover:underline"
                  >
                    Feedback
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://beekrowd.gitbook.io/beekrowd-financial-model-guide"
                    className="hover:underline"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark1:text-white">
                POLICIES AND TERMS
              </h2>
              <ul className="text-gray-500 dark1:text-gray-400 font-medium">
                {Vipolicies.map((policy, index) => (
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

              <PolicyModal
                isVisible={isModalVisible}
                content={modalContent}
                onClose={handleCancel}
              />
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark1:text-white">
                Contact
              </h2>
              <ul className="text-gray-500 dark1:text-gray-400 font-medium">
                <li className="mb-4">
                  <div className="hover:underline hover:cursor-pointer">
                    BeeKrowd Joint Stock Company
                  </div>
                </li>
                <li className="mb-4">
                  <div className="hover:underline hover:cursor-pointer">
                    Head office: Dreamplex 21 Nguyen Trung Ngan, Ben Nghe Ward,
                    District 1, Ho Chi Minh City.
                  </div>
                </li>
                <li className="mb-4">
                  <div className="hover:underline hover:cursor-pointer">
                    Hotline: +84 376.372.727{" "}
                  </div>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.beekrowd.com"
                    className="hover:underline hover:cursor-pointer"
                  >
                    Website: https://www.beekrowd.com
                  </a>
                </li>
                <li className="mb-4">
                  <div
                    href="Email: support@beekrowd.com"
                    className="hover:underline hover:cursor-pointer"
                  >
                    Email: support@beekrowd.com
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark1:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark1:text-gray-400">
            © 2024 <a className="hover:underline">BeeKrowd™</a>. All Rights
            Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <div id="google_translate_element"></div>

            <a
              href="https://www.facebook.com/BeeKrowd"
              className="text-gray-500 hover:text-gray-900 dark1:hover:text-white flex ms-5 justify-center items-center"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 8 19"
              >
                <path
                  fillRule="evenodd"
                  d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Facebook page</span>
            </a>

            <a
              href="https://twitter.com/BeeKrowd"
              className="text-gray-500 hover:text-gray-900 dark1:hover:text-white ms-5 flex justify-center items-center"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 17"
              >
                <path
                  fillRule="evenodd"
                  d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Twitter page</span>
            </a>

            <a
              href="https://vn.linkedin.com/company/beekrowd"
              className="text-gray-500 hover:text-gray-900 dark1:hover:text-white ms-5 flex justify-center items-center"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
                  clipRule="evenodd"
                />
                <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
              </svg>

              <span className="sr-only">Linkedin</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
