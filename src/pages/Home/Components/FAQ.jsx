import { useState } from "react";
import Header from "../Header";

const FAQ = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const faqData = [
    {
      question: "What is BeeKrowd service all about?",
      answer:
        "Our platform is designed to help individuals, organizations, and causes build business and fundraising profiles effectively and efficiently. We provide a platform and tools to facilitate fundraising campaigns for various needs.",
    },
    {
      question: "How does this work?",
      answer:
        "To get started, create a business profile or fundraising campaign by providing details about your cause, goals, and objectives. Share your campaign with your network, supporters, and on social media platforms.",
    },
    {
      question: "What can I do on BeeKrowd?",
      answer:
        "You can create a business profile or fundraising profile in various forms of investment, such as equity investment, lending, mergers and acquisitions, and convertibles. We support both individual and nonprofit efforts to create investment profiles in almost all fields, including healthcare, education, finance, manufacturing, logistics, technology, AI, and more.",
    },
    {
      question: "Is my personal information and data secure?",
      answer:
        "We take data security seriously. Our platform uses state-of-the-art encryption to protect your personal information.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <Header />
      <div className="grid md:grid-cols-5 gap-10 mt-28">
        <div className="md:col-span-2">
          <div className="max-w-xs">
            <h2
              id="FAQ"
              className="text-2xl font-semibold md:text-4xl md:leading-tight darkTextWhite"
            >
              Frequently
              <br />
              asked questions
            </h2>
            <p className="mt-1 hidden md:block text-gray-600 darkTextGray">
              Answers to the most frequently asked questions.
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="hs-accordion-group divide-y divide-gray-200 darkDivideGray">
            {faqData.map((item, index) => (
              <div
                className={`hs-accordion pb-3 ${
                  index === activeAccordion ? "active" : ""
                }`}
                key={index}
              >
                <button
                  className="mt-3 hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-md transition hover:text-gray-500 darkTextGray darkHoverTextWhite darkFocusOutlineNone darkFocusRing-1 darkFocus"
                  aria-controls={`hs-basic-with-title-and-arrow-stretched-collapse-${index}`}
                  onClick={() => toggleAccordion(index)}
                >
                  {item.question}
                  <svg
                    className={`hs-accordion-icon transform ${
                      index === activeAccordion ? "rotate-180" : "rotate-0"
                    } flex-shrink-0 w-5 h-5 text-gray-600 group-hover:text-gray-500 darkTextGray transition-transform`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div
                  id={`hs-basic-with-title-and-arrow-stretched-collapse-${index}`}
                  className={`hs-accordion-content overflow-hidden transition-all duration-300 ease-in-out ${
                    index === activeAccordion ? "max-h-[1000px]" : "max-h-0"
                  }`}
                  aria-labelledby={`hs-basic-with-title-and-arrow-stretched-heading-${index}`}
                >
                  <p className="text-gray-600 darkTextGray py-3">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
