const ContentSectionOne = () => {
  return (
    <div className="section zubuz-section-padding2 white-bg">
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div className="zubuz-thumb thumb-pr">
              <img src="/images/v1/mocup01.png" alt="" />
              <div className="zubuz-thumb-card">
                <img src="/images/v1/card1.png" alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-7 d-flex align-items-center">
            <div className="zubuz-default-content">
              <h2>Your ultimate AI-enabled financial control center.</h2>
              <p>
              A financial partner, helping users navigate the complexities of personal and business finances with ease and confidence.
              </p>
              <div className="zubuz-extara-mt">
                <p>
                  <span className="font-semibold">Dynamic Dashboards:</span> continuously monitors key financial metrics like cash flow, revenue, expenses, and profitability, presenting them in an intuitive, customizable interface.
                </p>
                <p>
                  <span className="font-semibold">Interactive Q&A:</span> Ask any financial question and receive a detailed, nuanced answer that considers the full scope of your financial data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSectionOne;
