import { Link } from "react-router-dom";
import { Button } from "../../../ui/button";
import { PlusIcon } from "lucide-react";

const PageHeader = ({ title, setIsCreatingBlog }) => {
  return (
    <div className="zubuz-breadcrumb">
      <div className="container">
        <h1 className="post__title">{title}</h1>
        <nav className="breadcrumbs">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-current="page"> {title}</li>
          </ul>
        </nav>

        {
          (title = "Our Blog" && (
            <Button
              type="button"
              className="w-full sm:w-auto !bg-black !text-white mt-5"
              onClick={() => setIsCreatingBlog(true)}
            >
              <PlusIcon className="mr-2" /> New blog
            </Button>
          ))
        }
      </div>
    </div>
  );
};

export default PageHeader;
