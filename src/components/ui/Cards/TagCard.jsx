import {Link} from "react-router-dom";

const TagCard = () => {
  return (
    <div class="widget">
      <h3 class="wp-block-heading">Tags:</h3>
      <div class="wp-block-tag-cloud">
        <Link to="">Marketing</Link>
        <Link to="">Business</Link>
        <Link to="">SaaS</Link>
        <Link to="">Development</Link>
        <Link to="">UI/UX</Link>
        <Link to="">Brand</Link>
      </div>
    </div>
  );
};

export default TagCard;
