import Marquee from "react-fast-marquee";

const BrandSection = () => {
  return (
    <div className="section dark-bg zubuz-section-padding4">
      <div className="container">
        <div className="row">
          <div className="col-lg-5 flex justify-center items-center">
            <div className="zubuz-brand-logo-content">
              <h3>
                Over 300 founders rely on our platform for their financial plan
              </h3>
            </div>
          </div>
          <div className="col-lg-7">
            <Marquee speed="30" className="zubuz-brand-slider">
              <div className="zubuz-brand-item">
                <img src="/images/v1/1.png" alt="" className="h-32" />
              </div>
              <div className="zubuz-brand-item">
                <img src="/images/v1/2.png" alt="" className="h-32" />
              </div>
              <div className="zubuz-brand-item">
                <img src="/images/v1/3.png" alt="" className="h-32" />
              </div>
              <div className="zubuz-brand-item">
                <img src="/images/v1/4.png" alt="" className="h-32" />
              </div>
              <div className="zubuz-brand-item">
                <img src="/images/v1/5.png" alt="" className="h-32" />
              </div>
              <div className="zubuz-brand-item">
                <img src="/images/v1/6.png" alt="" className="h-32" />
              </div>
            </Marquee>
            <Marquee
              speed="30"
              direction="right"
              className="zubuz-brand-slider"
              style={{ marginTop: "25px" }}
            >
              <div className="zubuz-brand-item">
                <img src="/images/v1/1.png" alt="" className="h-32" />
              </div>
              <div className="zubuz-brand-item">
                <img src="/images/v1/2.png" alt="" className="h-32" />
              </div>
              <div className="zubuz-brand-item">
                <img src="/images/v1/3.png" alt="" className="h-32" />
              </div>
              <div className="zubuz-brand-item">
                <img src="/images/v1/4.png" alt="" className="h-32" />
              </div>
              <div className="zubuz-brand-item">
                <img src="/images/v1/5.png" alt="" className="h-32" />
              </div>
              <div className="zubuz-brand-item">
                <img src="/images/v1/6.png" alt="" className="h-32" />
              </div>
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSection;
