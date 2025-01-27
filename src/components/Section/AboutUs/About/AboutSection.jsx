/* eslint-disable react/no-unescaped-entities */
const AboutSection = () => {
  return (
    <div className="section zubuz-section-padding3">
      <div className="container">
        <div className="zubuz-section-title zubuz-two-column-title">
          <div className="row">
            <div className="col-lg-7">
              <h2>Our company's journey story</h2>
            </div>
            <div className="col-lg-5 d-flex align-items-center">
              <p>
                Born in 2018 out of a passion for innovation and a commitment to
                redefining the startup ecosystem. Our story is one of
                persistence, resilience, and creativity. We proudly wave the
                flag of Vietnam, embodying the spirit and ambition of our nation
                in every endeavor.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-4">
            <div className="zubuz-about-thumb">
              <img src="/images/about/about1.png" alt="" />
            </div>
            <div className="zubuz-about-thumb">
              <img src="/images/about/about2.png" alt="" />
            </div>
          </div>
          <div className="col-lg-4 col-md-4 flex justify-center items-center">
            <div className="zubuz-about-thumb">
              <img src="/images/about/about3.png" alt="" />
            </div>
          </div>
          <div className="col-lg-4 col-md-4">
            <div className="zubuz-about-thumb">
              <img src="/images/about/about4.png" alt="" />
            </div>
            <div className="zubuz-about-thumb">
              <img src="/images/about/about5.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
