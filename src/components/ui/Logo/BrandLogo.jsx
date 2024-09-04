import { Link } from "react-router-dom";

const BrandLogo = ({ imageSrc }) => {
  const defaultImageSrc = "/images/logo/logo-dark.png";
  const logoSrc = imageSrc || defaultImageSrc;

  return (
    <div className="brand-logo">
      <Link to="/">
        <img src={logoSrc} alt="" className="light-version-logo" />
      </Link>
    </div>
  );
};

export default BrandLogo;
