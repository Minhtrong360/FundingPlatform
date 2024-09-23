import { Link } from "react-router-dom";
import { formatDate } from "../../../features/DurationSlice";
import { useState } from "react";
import { ArrowDownIcon, ArrowRightIcon, PenIcon, Check, X } from "lucide-react";
import { supabase } from "../../../supabase";
import { useAuth } from "../../../context/AuthContext";

const BlogCard = ({ post, onUpdate, setIsCreatingBlog, setSelectedBlog }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { currentUser } = useAuth();
  // Function to handle the toggle between expanded and truncated content
  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  // Truncate content to a maximum of 3 lines (approximate based on character length)
  const truncateText = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const maxLength = 150; // Adjust this value based on how much content fits in 3 lines

  const handleApprove = async () => {
    const { data, error } = await supabase
      .from("blogsV2")
      .update({ approved: true })
      .eq("id", post.id);

    if (error) {
      console.error("Error approving blog:", error);
    } else {
      onUpdate();
    }
  };
  const handleUnApprove = async () => {
    const { data, error } = await supabase
      .from("blogsV2")
      .update({ approved: false })
      .eq("id", post.id);

    if (error) {
      console.error("Error approving blog:", error);
    } else {
      onUpdate();
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="single-post-item">
        <div className="post-thumbnail relative">
          <img src={post?.cover} alt="" />
          {isHovered && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2 space-y-2">
              {currentUser[0]?.id === post.user_id && (
                <PenIcon
                  className="text-white cursor-pointer"
                  onClick={() => {
                    setIsCreatingBlog(true);
                    setSelectedBlog(post);
                  }}
                />
              )}
              {currentUser[0]?.admin && !post.approved && (
                <Check
                  className="text-white cursor-pointer"
                  onClick={handleApprove}
                />
              )}
              {currentUser[0]?.admin && post.approved && (
                <X
                  className="text-white cursor-pointer"
                  onClick={handleUnApprove}
                />
              )}
            </div>
          )}
        </div>
        <div className="post-content">
          <div className="post-meta">
            <div className="post-category">
              <Link to="">{post?.category}</Link>
            </div>
            <div className="post-date">{formatDate(post?.created_at)}</div>
          </div>
          <Link to={post?.link}>
            <h3 className="entry-title">{post?.title}</h3>
          </Link>
          <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {isExpanded
              ? post?.content
              : truncateText(post?.content, maxLength)}
          </p>
          <Link className="post-read-more" onClick={toggleContent}>
            {isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
