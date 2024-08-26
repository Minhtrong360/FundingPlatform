
import FeatureCardTwo from './../../../ui/Cards/FeatureTwo';
const FeatureSection = () => {
  return (
    <div className="section zubuz-section-padding3">
      <div className="container">
        <div className="zubuz-section-title center">
          <h2>Features to improve your education.</h2>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <FeatureCardTwo
              icon="/images/v2/icon-v2-1.png"
              title="Personalized learning paths:"
              description="Allow students to set personal learning goals within the LMS and track their progress. This feature can include reminders, progress dashboards, and motivational feedback.."
              image="/images/v2/card-v2-1.png"
            />
            <FeatureCardTwo
              icon="/images/v2/icon-v2-3.png"
              title="Interactive Content:"
              description="Introduce gamified elements like badges, leaderboards, and rewards to make learning more engaging. Gamification can increase motivation and encourage students to complete courses.."
              image="/images/v2/card-v2-3.png"
            />
          </div>
          <div className="col-lg-6">
            <FeatureCardTwo
              icon="/images/v2/icon-v2-2.png"
              title="Scalability and Flexibility:"
              description="Ensure the LMS can scale to accommodate a growing number of users and courses without compromising performance. This includes cloud-based solutions that offer flexibility and scalability."
              image="/images/v2/card-v2-2.png"
            />
            <FeatureCardTwo
              icon="/images/v2/icon-v2-4.png"
              title="Enhanced communication tools:"
              description="Provide a built-in messaging system and task management tool for communication between students and instructors, allowing for quick feedback and support."
              image="/images/v2/card-v2-4.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
