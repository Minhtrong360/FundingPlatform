import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CategoryCard from "./../../ui/Cards/CategoryCard";
import PostCard from "./../../ui/Cards/PostCard";
import TagCard from "./../../ui/Cards/TagCard";
import BlogCard from "./../../ui/Cards/BlogCard";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { message, Modal } from "antd";
import industries from "../../Industries";
import { supabase } from "../../../supabase";
import { Badge } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const BlogSection = ({ isCreatingBlog, setIsCreatingBlog }) => {
  const [originalBlogData, setOriginalBlogData] = useState([]); // Lưu dữ liệu ban đầu
  const [blogData, setBlogData] = useState([]); // Lưu dữ liệu hiện tại (sau khi filter hoặc gốc)
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch blog data từ Supabase khi load lần đầu
  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    const { data, error } = await supabase
      .from("blogsV2")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error);
      setOriginalBlogData([]); // Nếu có lỗi thì set mảng rỗng
      setBlogData([]);
    } else if (data) {
      setOriginalBlogData(data); // Lưu dữ liệu gốc vào originalBlogData
      setBlogData(data); // Hiển thị dữ liệu ban đầu
    } else {
      setOriginalBlogData([]);
      setBlogData([]);
    }
  };
  const [suggestions, setSuggestions] = useState([]);
  // Hàm xử lý khi thay đổi searchTerm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      // Filter blogData theo searchTerm
      const filteredBlogs = originalBlogData.filter((blog) =>
        blog.title.toLowerCase().includes(value.toLowerCase())
      );
      setBlogData(filteredBlogs); // Hiển thị blog đã lọc
      setSuggestions(filteredBlogs);
    } else {
      // Nếu searchTerm trống, khôi phục dữ liệu ban đầu
      setBlogData(originalBlogData);
      setSuggestions([]);
    }

    setCurrentPage(1); // Reset lại trang đầu tiên khi filter
  };

  // Tính toán các blogs hiện tại để hiển thị (sau khi phân trang)
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

  const { currentUser } = useAuth();

  const filterBlogs = () => {
    if (currentUser[0]?.admin) {
      return blogData; // Hiển thị toàn bộ blogs nếu user là admin
    }

    return blogData.filter((blog) => {
      // Nếu blog chưa được approved nhưng thuộc về user hiện tại
      if (!blog.approved && blog.user_id === currentUser[0].id) {
        return true;
      }

      // Nếu blog đã được approved hoặc blog không thuộc về user và admin không phải là false
      return blog.approved || blog.user_id === currentUser[0].id;
    });
  };

  // Sau khi filter các blogs, dùng kết quả để hiển thị
  const filteredBlogs = filterBlogs();
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Hàm xử lý phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSuggestionClick = (blog) => {
    setBlogData([blog]);
    setSuggestions([]);
  };

  const [selectedCategory, setSelectedCategory] = useState(""); // Lưu danh mục được chọn

  const uniqueCategories = [
    ...new Set(originalBlogData.map((blog) => blog.category)),
  ];

  // Hàm xử lý khi nhấp vào một danh mục
  const handleCategoryClick = (category) => {
    if (category === selectedCategory) {
      // Nếu nhấp vào danh mục đã chọn, bỏ chọn danh mục
      setSelectedCategory("");
      setBlogData(originalBlogData);
    } else {
      // Lọc các blog theo danh mục
      const filteredBlogs = originalBlogData.filter(
        (blog) => blog.category === category
      );
      setSelectedCategory(category); // Set danh mục đã chọn
      setBlogData(filteredBlogs); // Hiển thị blog đã lọc
    }

    setCurrentPage(1); // Reset lại trang đầu tiên khi filter
  };

  const handleUpdate = () => {
    fetchBlogData(); // Fetch blogs again to get the updated data
  };

  const [selectedBlog, setSelectedBlog] = useState();
  return (
    <div className="section zubuz-section-padding2">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {/* Hiển thị các blogs sau khi phân trang */}
            {currentBlogs.map((post) => (
              <BlogCard
                key={post?.id}
                post={post}
                onUpdate={handleUpdate}
                setIsCreatingBlog={setIsCreatingBlog}
                setSelectedBlog={setSelectedBlog}
              />
            ))}

            {/* Phân trang */}
            <div className="zubuz-navigation">
              <nav className="navigation pagination" aria-label="Posts">
                <div className="nav-links">
                  {[
                    ...Array(Math.ceil(blogData.length / blogsPerPage)).keys(),
                  ].map((page) => (
                    <span
                      key={page + 1}
                      className={`page-numbers ${page + 1 === currentPage ? "current" : ""}`}
                      onClick={() => paginate(page + 1)}
                      style={{ cursor: "pointer" }}
                    >
                      {page + 1}
                    </span>
                  ))}
                  {currentPage < Math.ceil(blogData.length / blogsPerPage) && (
                    <span
                      className="next page-numbers"
                      onClick={() => paginate(currentPage + 1)}
                      style={{ cursor: "pointer" }}
                    >
                      next
                    </span>
                  )}
                </div>
              </nav>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="right-sidebar">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pr-8 mb-4"
                  value={searchTerm}
                  onChange={handleSearchChange} // Thay đổi sự kiện onChange
                />
                <svg
                  className="absolute right-2 top-[0.75rem] h-4 w-4 text-muted-foreground"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              {suggestions.length > 0 && (
                <ul className=" mt-2 top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
                  {suggestions.map((blog, index) => (
                    <li
                      key={index}
                      className="text-left text-sm px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                      onClick={() => handleSuggestionClick(blog)}
                    >
                      <span className="truncate">{blog.title}</span>
                    </li>
                  ))}
                </ul>
              )}

              <CategoryCard
                uniqueCategories={uniqueCategories}
                handleCategoryClick={handleCategoryClick}
                selectedCategory={selectedCategory}
              />
              <PostCard
                blogs={originalBlogData}
                handleCategoryClick={handleCategoryClick}
              />
              <TagCard />
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">
                    How can we help you?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We are here to help you! Tell us how we can help and we'll
                    get in touch within next 24hrs.
                  </p>
                  <form className="space-y-4">
                    <Input placeholder="Enter your email" />
                    <Button className="w-full bg-[#18181B] text-white">
                      Contact Us
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Modal
        zIndex={42424244}
        title={null}
        open={isCreatingBlog}
        onCancel={() => {
          setSelectedBlog("");
          setIsCreatingBlog(false);
        }}
        footer={null}
        centered
      >
        <BlogPostCreator
          onPostCreated={() => setIsCreatingBlog(false)}
          selectedBlog={selectedBlog}
          setBlogData={setBlogData}
          setOriginalBlogData={setOriginalBlogData}
        />
      </Modal>
    </div>
  );
};

export default BlogSection;

function BlogPostCreator({
  onPostCreated,
  selectedBlog,
  setBlogData,
  setOriginalBlogData,
}) {
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (selectedBlog) {
      setImage(selectedBlog.cover);
      setTitle(selectedBlog.title);
      setContent(selectedBlog.content);
      setSelectedCategory(selectedBlog.category);
    } else {
      setImage(null);
      setTitle("");
      setContent("");
      setSelectedCategory(null);
    }
  }, [selectedBlog]);

  const getTimestampFileName = () => {
    const timestamp = Date.now(); // Get the current timestamp
    return `${timestamp}.png`; // Return a file name like 'timestamp.png'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    let saveImage;
    if (image && typeof image === "object" && image.name) {
      // If it's a new file (object type), upload the image
      const fileName = getTimestampFileName(); // Generate the file name with the timestamp

      const { data: avatarData, error: avatarError } = await supabase.storage
        .from("beekrowd_storage") // Supabase bucket
        .upload(`beekrowd_images/${fileName}`, image); // Use the timestamp-based file name

      if (avatarError) {
        throw new Error("Avatar upload failed");
      }
      saveImage = `https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/${avatarData.fullPath}`;
    } else if (image && typeof image === "string") {
      // If it's an existing image URL
      saveImage = image;
    }

    // Prepare blog data
    const blogPost = {
      category: selectedCategory,
      title,
      content,
      cover: saveImage, // Save the image URL or the newly uploaded file URL
    };

    try {
      if (!selectedBlog) {
        const { data, error } = await supabase
          .from("blogsV2")
          .insert([blogPost]);

        if (error) {
          console.error("Error saving blog post:", error);
        } else {
          message.success("Blog created successfully!");
          setBlogData((prevBlogs) => [...prevBlogs, blogPost]); // Add new blog to list
        }
      } else {
        const { data, error: updatedError } = await supabase
          .from("blogsV2")
          .update({
            category: selectedCategory,
            title,
            content,
            cover: saveImage,
            approved: false,
          })
          .eq("id", selectedBlog.id);

        if (updatedError) {
          console.error("Error updating blog post:", updatedError);
        } else {
          message.success("Blog updated successfully!");

          // Update blogData with the updated blog post
          setBlogData((prevBlogs) =>
            prevBlogs.map((blog) =>
              blog.id === selectedBlog.id ? { ...blog, ...blogPost } : blog
            )
          );
          setOriginalBlogData((prevBlogs) =>
            prevBlogs.map((blog) =>
              blog.id === selectedBlog.id ? { ...blog, ...blogPost } : blog
            )
          );
        }
      }

      setImage(null);
      setSelectedCategory(null);
      setTitle(null);
      setContent(null);
      onPostCreated(); // Close modal after creation
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="w-full max-w-3xl mx-auto">
      <CardHeader className="!px-0">
        <CardTitle>
          {!selectedBlog ? "Create a New Blog Post" : "Update Your Blog"}
        </CardTitle>
      </CardHeader>
      <CardContent className="!px-0">
        <form className="space-y-4">
          <div>
            <Label htmlFor="image">Header Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mx-4 file:px-4 file:rounded-md file:border-[0.5px] file:border-gray-300 file:bg-white file:text-gray-700 hover:file:bg-gray-50 hover:file:cursor-pointer"
            />
            {typeof image === "string" &&
              image.includes("beekrowd_storage") && (
                <img
                  src={image}
                  alt="Preview"
                  className="mt-2 rounded-md max-h-48 object-cover"
                />
              )}
            {image?.name && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-2 rounded-md max-h-48 object-cover"
              />
            )}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              name="category"
              onValueChange={setSelectedCategory}
              value={selectedCategory}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white !z-[9999]">
                {industries.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your blog post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your blog post content here"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="!px-0">
        <Button
          type="submit"
          className="w-full text-white"
          disabled={isSaving}
          onClick={handleSubmit}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </div>
  );
}
