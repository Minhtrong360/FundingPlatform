import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

import ReactModal from "react-modal";
import Spinner from "../../components/Spinner";
import { Tooltip, message } from "antd";
import PricingWithLemon from "../Home/Components/PricingWithLemon";
import { PlusCircleOutlined } from "@ant-design/icons";
import SpinnerBtn from "../../components/SpinnerBtn";

const Modal = ({
  isOpen,
  onClose,
  currentProject,
  handleAddLinks,
  link,
  setLink,
  fileName,
  setFileName,
  isPublic,
  setIsPublic,
  isPrivateDisabled,
}) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  if (!isOpen) {
    return null;
  }

  const addLink = async () => {
    if (!file && (!link.trim() || !fileName.trim())) {
      alert("Please enter a valid link and file name or select a file.");
      return;
    }

    setIsLoading(true);
    let fileUrl = link;

    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileNameWithExt = `${Date.now()}.${fileExt}`;
      const filePath = `profile_dataroom/${fileNameWithExt}`;

      const { data, error } = await supabase.storage
        .from("beekrowd_storage")
        .upload(filePath, file);

      if (error) {
        alert("Error uploading file: " + error.message);
        return;
      }
      const publicURL = `https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/${data.fullPath}`;

      fileUrl = publicURL;
    }

    const newLink = {
      name: fileName,
      link: fileUrl,
      status: isPublic,
    };

    handleAddLinks(newLink);
    setLink("");
    setFileName("File 1");
    setFile(null);
    onClose();
    setIsLoading(false);
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
    if (e.target.value.trim() !== "") {
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      setLink("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
        <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize">
          Project Name: {currentProject.name}
        </h3>

        <form className="mt-4">
          <label className="block mt-3">
            <input
              type="text"
              name="File_name"
              placeholder="File"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
            />
          </label>

          <label className="block mt-3">
            <input
              type="text"
              name="File_link"
              placeholder="File link"
              value={link}
              onChange={handleLinkChange}
              className={`block w-full px-4 py-3 text-sm text-gray-700 ${file ? "border-gray-100" : "border"} rounded-md`}
              disabled={file !== null}
            />
          </label>

          <label className="block mt-3">
            <input
              type="file"
              name="File_upload"
              onChange={handleFileChange}
              className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
              disabled={link.trim() !== ""}
            />
          </label>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">Project Type:</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="projectType"
                  value="public"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">Public</span>
              </label>
              {isPrivateDisabled ? (
                <Tooltip
                  title={`You need to upgrade your plan to upload a private file`}
                  color="gray"
                  zIndex={20000}
                >
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="projectType"
                      value="private"
                      disabled={isPrivateDisabled}
                      className={`form-radio h-5 w-5 ${
                        isPrivateDisabled
                          ? "border-gray-300"
                          : "border-gray-600"
                      }`}
                    />
                    <span className="ml-2 text-gray-300">Private</span>
                  </label>
                </Tooltip>
              ) : (
                <>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="projectType"
                      value="private"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      disabled={isPrivateDisabled}
                      className={`form-radio h-5 w-5 ${
                        isPrivateDisabled
                          ? "border-gray-300"
                          : "border-gray-600"
                      }`}
                    />
                    <span className="ml-2 text-gray-700">Private</span>
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-10">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={addLink}
              className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
            >
              {isLoading ? <SpinnerBtn /> : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AddLinkFile({
  isLoading,
  currentProject,
  handleAddLinks,
  isPrivateDisabled,
}) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (!navigator.onLine) {
          message.error("No internet access.");
          return;
        }
        let { data: users, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id);

        if (error) {
          console.log("error", error);
          throw error;
        }

        setCurrentUser(users[0]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchCurrentUser();
    }
  }, [user]);

  const [link, setLink] = useState("");
  const [fileName, setFileName] = useState("File name");
  const [isPublic, setIsPublic] = useState(true);

  if (isLoading) {
    return <Spinner />;
  }
  const closeModalPricing = () => {
    setIsPricingOpen(false);
  };

  return (
    <div className="App">
      {(user?.id === currentProject?.user_id ||
        currentProject?.collabs?.includes(user.email)) && (
        <button
          className={`text-white bg-blue-600 hover:bg-blue-700800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2 text-center darkBgBlue darkHoverBgBlue darkFocus `}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleOutlined /> Add file
        </button>
      )}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "gray",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
          },
          content: {
            border: "none",
            background: "none",
          },
        }}
      >
        <Modal
          zIndex={42424244}
          isOpen={isModalOpen}
          currentProject={currentProject}
          handleAddLinks={handleAddLinks}
          link={link}
          setLink={setLink}
          fileName={fileName}
          setFileName={setFileName}
          isPublic={isPublic}
          setIsPublic={setIsPublic}
          onClose={() => setIsModalOpen(false)}
          currentUser={currentUser}
          setIsPricingOpen={setIsPricingOpen}
          isPrivateDisabled={isPrivateDisabled}
        />
      </ReactModal>

      <ReactModal
        isOpen={isPricingOpen}
        onRequestClose={closeModalPricing}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "gray",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
          },
        }}
      >
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
          <div className="relative p-8 bg-white w-full  m-auto flex-col flex rounded-md">
            <PricingWithLemon />
            <div className="mt-4 flex items-center gap-10">
              <button
                className="max-w-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
                onClick={closeModalPricing}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}
