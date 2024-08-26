import {Link} from "react-router-dom";

const IntegrationSection = () => {
  return (
    <div className="section zubuz-section-padding">
      <div className="container">
        <div className="zubuz-section-title zubuz-two-column-title">
          <div className="row">
            <div className="col-lg-8">
              <h2>Positive experiences of clients</h2>
            </div>
            <div className="col-lg-4 d-flex align-items-center">
              <div className="zubuz-title-btn">
                <Link className="zubuz-default-btn pill" to="integrations">
                  <span>Browse all integrations</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="zubuz-tools-wrap">
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools1.png" alt="" />
          </div>
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools2.png" alt="" />
          </div>
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools3.png" alt="" />
          </div>
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools4.png" alt="" />
          </div>
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools5.png" alt="" />
          </div>
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools6.png" alt="" />
          </div>
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools7.png" alt="" />
          </div>
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools8.png" alt="" />
          </div>
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools9.png" alt="" />
          </div>
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools10.png" alt="" />
          </div>
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools11.png" alt="" />
          </div>
          <div className="zubuz-tools-item">
            <img src="/images/v2/tools/tools12.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSection;
