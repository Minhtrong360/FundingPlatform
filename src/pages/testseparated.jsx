import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import Modal from "react-modal";
import {
  BlockNoteView,
  createReactBlockSpec,
  getDefaultReactSlashMenuItems,
  useBlockNote,
} from "@blocknote/react";
import "@blocknote/core/style.css";

import { useNavigate, useParams } from "react-router-dom";
import Header from "./Home/Header";
import {
  defaultBlockSchema,
  defaultBlockSpecs,
  defaultProps,
} from "@blocknote/core";
import { DownOutlined, YoutubeOutlined } from "@ant-design/icons";
import { Input, Avatar } from "antd";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import LoadingButtonClick from "../components/LoadingButtonClick";
import AnnouncePage from "../components/AnnouncePage";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import { formatNumber } from "../features/CostSlice";
import ProfileInfo from "./FounderGitbook/ProfileInfo";
import StarOutlined from "@ant-design/icons/StarOutlined";

const { TabPane } = Tabs;




const MyTab = () => {
  const [activeTab, setActiveTab] = useState("Introduction");
  const [youtubeLink, setYoutubeLink] = useState("Add wanted youtube url");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInsertYouTubeLink = () => {
    // Your implementation here
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const tabContents = {
    Introduction: (
      <div>
        <h2 className="text-red-600 font-bold text-3xl"> Introduction </h2>
        <div>
          Content for Introduction tab
        </div>
      </div>
    ),
    // Define content for other tabs similarly
  };

  return (
    <div className="flex">
      <aside className="w-full md:w-1/4 py-8">
        <div className="sticky top-8 space-y-4">
          {/* Navbar */}
          {Object.keys(tabContents).map(tab => (
            <div
              key={tab}
              className={`cursor-pointer ${activeTab === tab ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </aside>
      <div className="w-full md:w-3/4 py-8 px-4 md:px-8">
        {/* Content */}
        {tabContents[activeTab]}
      </div>
      <Modal
        ariaHideApp={false}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="YouTube Link Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
            zIndex: 9999,
          },
          content: {
            border: "none",
            background: "none",
            margin: "auto",
          },
        }}
      >
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
          <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
            <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
              Enter YouTube Video URL
            </h2>
            <input
              className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
              type="text"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
            />
            <div className="mt-4 flex items-center gap-10">
              <button
                className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
                onClick={handleInsertYouTubeLink}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// export default MyTab;


// const MyTabM = () => {
//   const [activeTab, setActiveTab] = useState("Introduction");

//   const [blocks, setBlocks] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [youtubeLink, setYoutubeLink] = useState("Add wanted youtube url"); // State to store YouTube link
//   const YouTubeLinkBlock = createReactBlockSpec(
//     {
//       type: "youtubeLink",
//       propSchema: {
//         ...defaultProps,
//         videoId: {
//           default: "",
//         },
//       },
//       content: "none",
//     },
//     {
//       render: ({ block }) => {
//         return (
//           <div
//             className=" flex justify-center relative w-full"
//             style={{ paddingBottom: "56.25%" }}
//           >
//             {block.props.videoId && (
//               <iframe
//                 className="absolute top-0 left-0 w-full h-full"
//                 src={`https://www.youtube.com/embed/${block.props.videoId}`}
//                 title="YouTube video player"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               ></iframe>
//             )}
//           </div>
//         );
//       },
//       toExternalHTML: ({ block }) => {
//         // Generate the HTML code for the YouTube video player
//         if (block.props.videoId) {
//           return `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/${block.props.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
//         }
//         return "";
//       },
//       parse: (element) => {
//         // Parse the video ID from the HTML code if available
//         const iframe = element.querySelector("iframe");
//         if (iframe) {
//           const src = iframe.getAttribute("src");
//           const videoIdMatch = src.match(/embed\/([^?]+)/);
//           if (videoIdMatch) {
//             return {
//               videoId: videoIdMatch[1],
//             };
//           }
//         }
//       },
//     }
//   );
//   const insertYouTubeLink = {
//     name: "Youtube",
//     execute: (editor) => {
//       openModal(); // Open the Modal
//     },
//     aliases: ["youtube", "video", "link"],
//     group: "Other",
//     icon: <YoutubeOutlined />,
//   };
//   // Function to open the Modal
//   const openModal = () => {
//     setIsModalOpen(true);
//   };
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const blockSchema = {
//     // Adds all default blocks.
//     ...defaultBlockSchema,
//     // Adds the YouTube Link block.
//     youtubeLink: YouTubeLinkBlock.config,
//   };

//   // Our block specs, which contain the configs and implementations for blocks
//   // that we want our editor to use.
//   const blockSpecs = {
//     // Adds all default blocks.
//     ...defaultBlockSpecs,
//     // Adds the YouTube Link block.
//     youtubeLink: YouTubeLinkBlock,
//   };

//   const editor = useBlockNote({
//     blockSpecs: blockSpecs,
//     // uploadFile: uploadToCustomDatabase,
//     slashMenuItems: [
//       ...getDefaultReactSlashMenuItems(blockSchema),
//       insertYouTubeLink,
//     ],
//     onEditorContentChange: function (editor) {
//       setBlocks(editor.topLevelBlocks);
//       // setIsSaved(false); // Đánh dấu là chưa lưu khi có sự thay đổi
//     },
//   });
//   const handleInsertYouTubeLink = () => {
//     if (youtubeLink.trim() !== "") {
//       // Parse the video ID from the YouTube link using a regular expression
//       const videoIdMatch = youtubeLink.match(
//         /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=|watch\?feature=player_embedded&v=|watch\?v=|watch\?v=))([^&?\s]+)/
//       );

//       const videoId = videoIdMatch ? videoIdMatch[1] : null;

//       if (videoId) {
//         // Insert the YouTube Link block with the extracted video ID
//         editor.insertBlocks(
//           [
//             {
//               type: "youtubeLink",
//               props: {
//                 videoId: videoId,
//               },
//             },
//           ],
//           editor.getTextCursorPosition().block,
//           "after"
//         );
//         closeModal(); // Close the Modal
//       } else {
//         alert("Invalid YouTube video URL. Please provide a valid URL.");
//       }
//     }
//   };

//   const tabContents = {
//     Introduction: (
//       <div>
//         {" "}
//         <h2 className="text-red-600 font-bold text-3xl"> Introduction </h2>
//         <BlockNoteView
//           editor={editor}
//           theme={"light"}
//           className="w-full lg:w-12/12 mt-8"
//         />
//         <Modal
//           ariaHideApp={false}
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           contentLabel="YouTube Link Modal"
//           style={{
//             overlay: {
//               backgroundColor: "gray", // Màu nền overlay
//               position: "fixed", // Để nền overlay cố định
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
//             },
//             content: {
//               border: "none", // Để ẩn border của nội dung Modal
//               background: "none", // Để ẩn background của nội dung Modal
//               margin: "auto", // Để căn giữa
//             },
//           }}
//         >
//           <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
//             <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
//               <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
//                 Enter YouTube Video URL
//               </h2>
//               <input
//                 className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
//                 type="text"
//                 value={youtubeLink}
//                 onChange={(e) => setYoutubeLink(e.target.value)}
//               />
//               <div className="mt-4 flex items-center gap-10">
//                 <button
//                   className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
//                   onClick={handleInsertYouTubeLink}
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     ),
//     "Market Research": (
//       <div>
//         {" "}
//         <h2 className="text-red-600 font-bold text-3xl"> Market Research </h2>
//         <BlockNoteView
//           editor={editor}
//           theme={"light"}
//           className="w-full lg:w-12/12 mt-8"
//         />
//         <Modal
//           ariaHideApp={false}
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           contentLabel="YouTube Link Modal"
//           style={{
//             overlay: {
//               backgroundColor: "gray", // Màu nền overlay
//               position: "fixed", // Để nền overlay cố định
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
//             },
//             content: {
//               border: "none", // Để ẩn border của nội dung Modal
//               background: "none", // Để ẩn background của nội dung Modal
//               margin: "auto", // Để căn giữa
//             },
//           }}
//         >
//           <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
//             <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
//               <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
//                 Enter YouTube Video URL
//               </h2>
//               <input
//                 className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
//                 type="text"
//                 value={youtubeLink}
//                 onChange={(e) => setYoutubeLink(e.target.value)}
//               />
//               <div className="mt-4 flex items-center gap-10">
//                 <button
//                   className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
//                   onClick={handleInsertYouTubeLink}
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     ),
//     "Customer Persona": (
//       <div>
//         {" "}
//         <h2 className="text-red-600 font-bold text-3xl"> Customer Persona </h2>
//         <BlockNoteView
//           editor={editor}
//           theme={"light"}
//           className="w-full lg:w-12/12 mt-8"
//         />
//         <Modal
//           ariaHideApp={false}
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           contentLabel="YouTube Link Modal"
//           style={{
//             overlay: {
//               backgroundColor: "gray", // Màu nền overlay
//               position: "fixed", // Để nền overlay cố định
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
//             },
//             content: {
//               border: "none", // Để ẩn border của nội dung Modal
//               background: "none", // Để ẩn background của nội dung Modal
//               margin: "auto", // Để căn giữa
//             },
//           }}
//         >
//           <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
//             <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
//               <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
//                 Enter YouTube Video URL
//               </h2>
//               <input
//                 className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
//                 type="text"
//                 value={youtubeLink}
//                 onChange={(e) => setYoutubeLink(e.target.value)}
//               />
//               <div className="mt-4 flex items-center gap-10">
//                 <button
//                   className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
//                   onClick={handleInsertYouTubeLink}
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     ),
//     "Competitor Analysis": (
//       <div>
//         {" "}
//         <h2 className="text-red-600 font-bold text-3xl">
//           {" "}
//           Competitor Analysis{" "}
//         </h2>
//         <BlockNoteView
//           editor={editor}
//           theme={"light"}
//           className="w-full lg:w-12/12 mt-8"
//         />
//         <Modal
//           ariaHideApp={false}
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           contentLabel="YouTube Link Modal"
//           style={{
//             overlay: {
//               backgroundColor: "gray", // Màu nền overlay
//               position: "fixed", // Để nền overlay cố định
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
//             },
//             content: {
//               border: "none", // Để ẩn border của nội dung Modal
//               background: "none", // Để ẩn background của nội dung Modal
//               margin: "auto", // Để căn giữa
//             },
//           }}
//         >
//           <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
//             <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
//               <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
//                 Enter YouTube Video URL
//               </h2>
//               <input
//                 className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
//                 type="text"
//                 value={youtubeLink}
//                 onChange={(e) => setYoutubeLink(e.target.value)}
//               />
//               <div className="mt-4 flex items-center gap-10">
//                 <button
//                   className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
//                   onClick={handleInsertYouTubeLink}
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     ),
//     "Business Model": (
//       <div>
//         {" "}
//         <h2 className="text-red-600 font-bold text-3xl"> Business Model </h2>
//         <BlockNoteView
//           editor={editor}
//           theme={"light"}
//           className="w-full lg:w-12/12 mt-8"
//         />
//         <Modal
//           ariaHideApp={false}
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           contentLabel="YouTube Link Modal"
//           style={{
//             overlay: {
//               backgroundColor: "gray", // Màu nền overlay
//               position: "fixed", // Để nền overlay cố định
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
//             },
//             content: {
//               border: "none", // Để ẩn border của nội dung Modal
//               background: "none", // Để ẩn background của nội dung Modal
//               margin: "auto", // Để căn giữa
//             },
//           }}
//         >
//           <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
//             <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
//               <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
//                 Enter YouTube Video URL
//               </h2>
//               <input
//                 className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
//                 type="text"
//                 value={youtubeLink}
//                 onChange={(e) => setYoutubeLink(e.target.value)}
//               />
//               <div className="mt-4 flex items-center gap-10">
//                 <button
//                   className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
//                   onClick={handleInsertYouTubeLink}
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     ),
//     "Competitive Advantages": (
//       <div>
//         {" "}
//         <h2 className="text-red-600 font-bold text-3xl">
//           {" "}
//           Competitive Advantages{" "}
//         </h2>
//         <BlockNoteView
//           editor={editor}
//           theme={"light"}
//           className="w-full lg:w-12/12 mt-8"
//         />
//         <Modal
//           ariaHideApp={false}
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           contentLabel="YouTube Link Modal"
//           style={{
//             overlay: {
//               backgroundColor: "gray", // Màu nền overlay
//               position: "fixed", // Để nền overlay cố định
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
//             },
//             content: {
//               border: "none", // Để ẩn border của nội dung Modal
//               background: "none", // Để ẩn background của nội dung Modal
//               margin: "auto", // Để căn giữa
//             },
//           }}
//         >
//           <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
//             <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
//               <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
//                 Enter YouTube Video URL
//               </h2>
//               <input
//                 className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
//                 type="text"
//                 value={youtubeLink}
//                 onChange={(e) => setYoutubeLink(e.target.value)}
//               />
//               <div className="mt-4 flex items-center gap-10">
//                 <button
//                   className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
//                   onClick={handleInsertYouTubeLink}
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     ),
//     Fundraising: (
//       <div>
//         {" "}
//         <h2 className="text-red-600 font-bold text-3xl"> Fundraising </h2>
//         <BlockNoteView
//           editor={editor}
//           theme={"light"}
//           className="w-full lg:w-12/12 mt-8"
//         />
//         <Modal
//           ariaHideApp={false}
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           contentLabel="YouTube Link Modal"
//           style={{
//             overlay: {
//               backgroundColor: "gray", // Màu nền overlay
//               position: "fixed", // Để nền overlay cố định
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
//             },
//             content: {
//               border: "none", // Để ẩn border của nội dung Modal
//               background: "none", // Để ẩn background của nội dung Modal
//               margin: "auto", // Để căn giữa
//             },
//           }}
//         >
//           <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
//             <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
//               <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
//                 Enter YouTube Video URL
//               </h2>
//               <input
//                 className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
//                 type="text"
//                 value={youtubeLink}
//                 onChange={(e) => setYoutubeLink(e.target.value)}
//               />
//               <div className="mt-4 flex items-center gap-10">
//                 <button
//                   className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
//                   onClick={handleInsertYouTubeLink}
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     ),
//     "Why invest in us?": (
//       <div>
//         {" "}
//         <h2 className="text-red-600 font-bold text-3xl"> Why invest in us? </h2>
//         <BlockNoteView
//           editor={editor}
//           theme={"light"}
//           className="w-full lg:w-12/12 mt-8"
//         />
//         <Modal
//           ariaHideApp={false}
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           contentLabel="YouTube Link Modal"
//           style={{
//             overlay: {
//               backgroundColor: "gray", // Màu nền overlay
//               position: "fixed", // Để nền overlay cố định
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
//             },
//             content: {
//               border: "none", // Để ẩn border của nội dung Modal
//               background: "none", // Để ẩn background của nội dung Modal
//               margin: "auto", // Để căn giữa
//             },
//           }}
//         >
//           <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
//             <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
//               <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
//                 Enter YouTube Video URL
//               </h2>
//               <input
//                 className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
//                 type="text"
//                 value={youtubeLink}
//                 onChange={(e) => setYoutubeLink(e.target.value)}
//               />
//               <div className="mt-4 flex items-center gap-10">
//                 <button
//                   className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
//                   onClick={handleInsertYouTubeLink}
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     ),
//     Contact: (
//       <div>
//         {" "}
//         <h2 className="text-red-600 font-bold text-3xl"> Contact </h2>
//         <BlockNoteView
//           editor={editor}
//           theme={"light"}
//           className="w-full lg:w-12/12 mt-8"
//         />
//         <Modal
//           ariaHideApp={false}
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           contentLabel="YouTube Link Modal"
//           style={{
//             overlay: {
//               backgroundColor: "gray", // Màu nền overlay
//               position: "fixed", // Để nền overlay cố định
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
//             },
//             content: {
//               border: "none", // Để ẩn border của nội dung Modal
//               background: "none", // Để ẩn background của nội dung Modal
//               margin: "auto", // Để căn giữa
//             },
//           }}
//         >
//           <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
//             <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
//               <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
//                 Enter YouTube Video URL
//               </h2>
//               <input
//                 className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
//                 type="text"
//                 value={youtubeLink}
//                 onChange={(e) => setYoutubeLink(e.target.value)}
//               />
//               <div className="mt-4 flex items-center gap-10">
//                 <button
//                   className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
//                   onClick={handleInsertYouTubeLink}
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     ),
//     "Data Room": (
//       <div>
//         {" "}
//         <h2 className="text-red-600 font-bold text-3xl"> Data Room </h2>
//         <BlockNoteView
//           editor={editor}
//           theme={"light"}
//           className="w-full lg:w-12/12 mt-8"
//         />
//         <Modal
//           ariaHideApp={false}
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           contentLabel="YouTube Link Modal"
//           style={{
//             overlay: {
//               backgroundColor: "gray", // Màu nền overlay
//               position: "fixed", // Để nền overlay cố định
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
//             },
//             content: {
//               border: "none", // Để ẩn border của nội dung Modal
//               background: "none", // Để ẩn background của nội dung Modal
//               margin: "auto", // Để căn giữa
//             },
//           }}
//         >
//           <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
//             <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
//               <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
//                 Enter YouTube Video URL
//               </h2>
//               <input
//                 className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
//                 type="text"
//                 value={youtubeLink}
//                 onChange={(e) => setYoutubeLink(e.target.value)}
//               />
//               <div className="mt-4 flex items-center gap-10">
//                 <button
//                   className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
//                   onClick={handleInsertYouTubeLink}
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     ),
//   };

//   const handleTabChange = (key) => {
//     setActiveTab(key);
//   };

//   return (
//     <div className="p-4">
//       <Tabs activeKey={activeTab} onChange={handleTabChange} tabPosition="left">
//         {Object.keys(tabContents).map((tab) => (
//           <TabPane tab={tab} key={tab}>
//             {tabContents[tab]}
//           </TabPane>
//         ))}
//       </Tabs>
//     </div>
//   );
// };

// export default MyTabs;

export default function MyTabs() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [company, setCompany] = useState([]);
  const [viewError, setViewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const id = "3ec3f142-f33c-4977-befd-30d4ce2b764d";
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (projectError) {
          throw projectError;
        }

        if (
          projectData.status === "private" &&
          projectData.user_id !== user?.id &&
          !projectData.invited_user?.includes(user.email) &&
          !projectData.collabs?.includes(user.email)
        ) {
          setViewError(true);
          setIsLoading(false); // Người dùng không được phép xem, ngừng hiển thị loading
        } else {
          setViewError(false);
          const { data: companyData, error: companyError } = await supabase
            .from("company")
            .select("*")
            .eq("project_id", id)
            .single();

          if (companyError) {
            throw companyError;
          }

          setCompany(companyData);
          setIsLoading(false); // Dữ liệu đã tải xong, ngừng hiển thị loading
        }
      } catch (error) {
        console.error("Error fetching data:", error);

        setIsLoading(false); // Có lỗi xảy ra, ngừng hiển thị loading
      }
    };

    fetchData();
  }, [id, user?.email, user?.id]);

  if (viewError) {
    return (
      <div>
        <LoadingButtonClick isLoading={isLoading} />
        <AnnouncePage
          title="Permission Required"
          announce="This is a private project."
          describe="Send a request to the project owner to get access."
          sendRequest={true}
        />
      </div>
    );
  }

  if (company.length === 0 || !company) {
    return (
      <div>
        <LoadingButtonClick isLoading={isLoading} />
        <AnnouncePage
          title="Not found"
          announce="This project may be no longer exist."
          describe="This project may be deleted by its owner and no longer exist. Please choose another project."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ProfileInfo company={company} />

      <div className="mt-4 container mx-auto px-4 flex flex-col md:flex-row">
       <MyTab />
        <aside className="w-full md:w-1/4 py-8 px-4 md:pl-8">
          <div className="sticky top-8 space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar src="/placeholder.svg?height=40&width=40" />
              <div>
                <h4 className="font-bold">Takegawa Pham</h4>
                <p className="text-sm text-gray-500">34k followers</p>
              </div>
            </div>
            <div className="mt-4">
              <p>Hey! I'm Takegawa. I'm the founder of BeeKrowd.</p>
              <div className="mt-4">
                <h5 className="font-bold text-gray-700">Location</h5>
                <p className="text-sm text-gray-500">HCMC, Vietnam</p>
              </div>
              <div className="mt-4">
                <h5 className="font-bold text-gray-700">Joined</h5>
                <p className="text-sm text-gray-500">September 20, 2024</p>
              </div>
              <Button className="border border-gray-200  w-full mt-4">
                

                  Show interest &nbsp; <StarOutlined />

              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

