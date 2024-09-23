import {Link} from "react-router-dom";

const SerciveCard = ({ title, description, icon, link }) => {
  return (
    <div className="col-xl-4 col-md-6">
      <div className="zubuz-iconbox-wrap-left iconbox-left-border">
        <div className="zubuz-iconbox-icon bg-limegreen">
          <img style={{ width: "40px", height: "40px" }} src={icon} alt="" />
        </div>
        <div className="zubuz-iconbox-data data-small">
          <span>{title}</span>
          <p>{description}</p>
          <Link className="zubuz-iconbox-btn" href={link}>
            <span>Read more</span>
            <img src="/images/icon/arrow-right2.svg" alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SerciveCard;
