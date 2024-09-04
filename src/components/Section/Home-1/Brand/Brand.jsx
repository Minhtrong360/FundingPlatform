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
                <p className="text-white">FOODMAP</p>
              </div>
              <div className="zubuz-brand-item">
                <p className="text-white">VAN LANG UNIVERSITY</p>
              </div>
              <div className="zubuz-brand-item">
                <p className="text-white">MEGASHOP</p>
              </div>
              <div className="zubuz-brand-item">
                <p className="text-white">HOLOLAB</p>
              </div>
              <div className="zubuz-brand-item">
                <p className="text-white">BOSGAURUS</p>
              </div>
            </Marquee>
            <Marquee
              speed="30"
              direction="right"
              className="zubuz-brand-slider"
              style={{ marginTop: "25px" }}
            >
              <div className="zubuz-brand-item">
                <p className="text-white">FOODMAP</p>
              </div>
              <div className="zubuz-brand-item">
                <p className="text-white">VAN LANG UNIVERSITY</p>
              </div>
              <div className="zubuz-brand-item">
                <p className="text-white">MEGASHOP</p>
              </div>
              <div className="zubuz-brand-item">
                <p className="text-white">HOLOLAB</p>
              </div>
              <div className="zubuz-brand-item">
                <p className="text-white">BOSGAURUS</p>
              </div>
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSection;
