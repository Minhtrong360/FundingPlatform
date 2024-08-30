 

import {Link} from "react-router-dom";

const ErrosSection = () => {
  return (
    <div className="section zubuz-extra-section">
      <div className="container">
        <div className="zubuz-errors-wrap">
          <div className="zubuz-errors-thumb">
            <img src="/images/about/404.png" alt="" />
          </div>
          <h2>Oops! Looks like you took a wrong turn</h2>
          <div className="zubuz-extara-mt">
            <Link className="zubuz-default-btn" to="/">
              <span>Back To Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrosSection;
