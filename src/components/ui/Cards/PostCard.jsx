import { formatDate } from "../../../features/DurationSlice";

const PostCard = ({ blogs, handleCategoryClick }) => {
  return (
    <div className="widget zubuz_recent_posts_Widget">
      <h3 className="wp-block-heading">Recent Posts:</h3>
      {blogs.slice(0, 3).map((blog) => (
        <div
          key={blog.id}
          className="post-item hover:cursor-pointer"
          onClick={() => handleCategoryClick(blog.category)}
        >
          <div className="post-thumb">
            <img src={blog.cover} alt={blog.title} />
          </div>
          <div className="post-text">
            <div
              className="post-title "
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {blog.title}
            </div>
            <div className="post-date">{formatDate(blog.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostCard;
