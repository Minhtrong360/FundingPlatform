 
import { useEffect, useState } from "react";
import CountUp from "react-countup";
const ContentSectionOne = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("zubuz-counter");
      if (section) {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
        setIsVisible(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="section zubuz-section-padding2">
      <div id="zubuz-counter"></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div className="zubuz-v2-thumb thumb-mr">
              <img src="/images/v2/thumb-v2-1.png" alt="" />
              <div className="zubuz-v2-thumb-shape">
                <img src="/images/v2/shape3-v2.png" alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="zubuz-default-content">
              <h2>Enables superior education and training services</h2>
              <p>
              LMS software enhances educational support by tracking all student inquiries, issues, and learning requests. Support teams can respond more efficiently and promptly, leading to improved student satisfaction and engagement.
              </p>
              <div className="zubuz-extara-mt">
                <div className="zubuz-counter-wrap">
                  <div className="zubuz-counter-data">
                    <h2 className="zubuz-counter-number">
                      <span data-percentage="99" className="zubuz-counter">
                        {isVisible ? <CountUp end={99} duration={5} /> : 99}
                      </span>
                      %
                    </h2>
                    <p>Learner satisfaction</p>
                  </div>
                  <div className="zubuz-counter-data">
                    <h2 className="zubuz-counter-number">
                      <span data-percentage="3.5" className="zubuz-counter">
                        {isVisible ? <CountUp end={3} duration={5} /> : 3.5}
                      </span>
                      X
                    </h2>
                    <p>Skill learning faster</p>
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

export default ContentSectionOne;
