import React from "react";

const termsContent = [
  {
    title: "1. Purpose of BeeKrowd",
    content:
      "BeeKrowd is a company that provides a platform for business owners, founders, and users to create and manage business profiles and fundraising profiles.",
  },
  {
    title: "2. Privacy Protection",
    content:
      "BeeKrowd is committed to protecting the privacy of its users. We employ strict methods to safeguard your personal and business information. Our Privacy Policy outlines how we collect, use, and protect your data. By using our services, you consent to our Privacy Policy.",
  },
  {
    title: "3. Payment and Subscription Management",
    content:
      "a. BeeKrowd uses the services of a third party, Stripe, to manage payment processing and subscription services. By using BeeKrowd's platform, you agree to comply with Stripe's terms and conditions, as applicable.\n\nb. Users can subscribe to different BeeKrowd packages, including Free, Premium, and Platinum, each offering varying features and benefits. Subscription fees are billed monthly through Stripe.",
  },
  // Continuing from the previous sections...

  {
    title: "4. Use of Services",
    content:
      "a. By using BeeKrowd's services, you agree to abide by all applicable laws and regulations.\n\nb. You agree not to use BeeKrowd for any illegal or unauthorized purpose, including but not limited to copyright infringement, fraud, or any activity that violates these Terms.\n\nc. You are solely responsible for the content you create, publish, or share on BeeKrowd. You agree not to post any false, misleading, or harmful information.\n\nd. BeeKrowd reserves the right to suspend or terminate your account at its discretion, without notice, for any violation of these Terms.",
  },
  {
    title: "5. Limitation of Liability",
    content:
      "a. BeeKrowd strives to provide accurate and reliable information but does not guarantee the accuracy, completeness, or timeliness of the content on its platform.\n\nb. BeeKrowd is not liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the platform.",
  },
  {
    title: "6. Termination",
    content:
      "a. BeeKrowd reserves the right to terminate or suspend your access to the platform at any time, without prior notice, for any reason, including but not limited to violation of these Terms.",
  },
  {
    title: "7. Changes to Terms",
    content:
      "BeeKrowd may update or revise these Terms at any time. It is your responsibility to review them periodically for changes. Continued use of our platform after any modifications constitutes your acceptance of the revised Terms.",
  },
  {
    title: "8. Governing Law",
    content:
      "These Terms are governed by and construed in accordance with the laws of [jurisdiction], without regard to its conflict of law principles.",
  },
  {
    title: "9. Contact Information",
    content:
      "If you have any questions or concerns about these Terms or our services, please contact us at [contact email].",
  },
];

const TermSection = ({ title, content }) => {
  return (
    <div className="border-2 border-gray-100 rounded-md darkBorderGray">
      <div className="flex items-center justify-between w-full p-8">
        <h1 className="font-semibold text-gray-700 darkTextWhite">{title}</h1>
        <span className="text-gray-400 bg-gray-200 rounded-full"></span>
      </div>
      <hr className="border-gray-200 darkBorderGray" />
      <p className="p-8 text-sm text-gray-500 darkTextGray">{content}</p>
    </div>
  );
};

const TermsAndConditions = () => {
  return (
    <section className="bg-white darkBg">
      <div className="container max-w-4xl px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-800 lg:text-3xl darkTextWhite">
          Terms and Conditions for BeeKrowd
        </h1>
        <div className="mt-12 space-y-8">
          {termsContent.map((term, index) => (
            <TermSection
              key={index}
              title={term.title}
              content={term.content}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditions;
