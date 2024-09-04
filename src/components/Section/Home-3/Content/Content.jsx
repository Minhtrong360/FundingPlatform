const ContentSection = () => {
  return (
    <div className="section zubuz-section-padding5">
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div className="zubuz-v3-thumb">
              <img src="/images/v3/thumb-v3-2.png" alt="" />
              <div className="zubuz-v3-card">
                <img src="/images/v3/card-v3-4.png" alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="zubuz-default-content m-left">
              <h2>Refining your pitch and attracting the right investors</h2>
              <p>
              Create a personalized fundraising profile effortlessly with a SaaS platform by utilizing pre-built templates, integrating financial data, showcasing your startup's vision, and managing investor outreach.
              </p>
              <div className="zubuz-extara-mt">
                <div className="zubuz-iconbox-wrap-left mw-100">
                  <div className="zubuz-iconbox-icon none-bg">
                    <img style={{ width: '40px', height: '40px' }} src="/images/v3/icon11.svg" alt="" />
                  </div>
                  <div className="zubuz-iconbox-data data-small">
                    <span>Notion-like environment:</span>
                    <p>
                    It supports various types of content, such as text, images, tables, and embeds, and offers features like drag-and-drop organization, real-time collaboration..
                    </p>
                  </div>
                </div>
                <div className="zubuz-iconbox-wrap-left mw-100">
                  <div className="zubuz-iconbox-icon none-bg">
                    <img style={{ width: '40px', height: '40px' }} src="/images/v3/icon10.svg" alt="" />
                  </div>
                  <div className="zubuz-iconbox-data data-small">
                    <span>Deal facilitating features:</span>
                    <p>
                    Deal facilitating features streamline the process of negotiating, finalizing, and executing deal between startups and investors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
