const ContentSectionTwo = () => {
  return (
    <div className="section zubuz-section-padding5">
    <div className="container">
      <div className="row">
        <div className="col-lg-5 order-lg-2">
          <div className="zubuz-v2-thumb thumb-ml">
            <img src="/images/v2/thumb-v2-2.png" alt="" />
          </div>
        </div>
        <div className="col-lg-7">
          <div className="zubuz-default-content">
            <h2>A single platform to manage learning courses</h2>
            <p>The platform also enables seamless student enrollment, progress tracking, and communication, allowing educators to monitor performance and provide timely feedback.</p>
            <div className="zubuz-extara-mt">
              <div className="zubuz-iconbox-wrap-left">
                <div className="zubuz-iconbox-icon none-bg">
                  <img src="/images/v2/check.png" alt="" />
                </div>
                <div className="zubuz-iconbox-data">
                  <span>Courses management</span>
                  <p> It allows instructors to create and structure courses by adding modules, lessons, assignments, and assessments, all within an intuitive interface. .</p>
                </div>
              </div>
              <div className="zubuz-iconbox-wrap-left">
                <div className="zubuz-iconbox-icon none-bg">
                  <img src="/images/v2/check.png" alt="" />
                </div>
                <div className="zubuz-iconbox-data">
                  <span>Course Certification</span>
                  <p>Upon fulfilling course requirements—such as completing lessons, passing quizzes, and achieving set milestones—students can automatically receive digital certificates.</p>
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

export default ContentSectionTwo;
