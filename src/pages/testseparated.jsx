import React, { useState } from 'react';
import { Tabs } from 'antd';
import Modal from "react-modal";
import {
  BlockNoteView,
  createReactBlockSpec,
  getDefaultReactSlashMenuItems,
  useBlockNote,
} from "@blocknote/react";
import "@blocknote/core/style.css";

import { useNavigate, useParams } from "react-router-dom";
import Header from './Home/Header';
import {
  defaultBlockSchema,
  defaultBlockSpecs,
  defaultProps,
} from "@blocknote/core";
import { YoutubeOutlined } from "@ant-design/icons";
import {  Input, Avatar } from 'antd';
import {Button} from "../components/ui/Button";
import {Badge} from "../components/ui/Badge";
const { TabPane } = Tabs;

// const TabContent = ({ tab }) => {
//   // Define your content for each tab
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
//     Introduction: <div> <h2 className='text-red-600 font-bold text-3xl'> Introduction </h2> 
//     <BlockNoteView
//     editor={editor}
//     theme={"light"}
//     className="w-full lg:w-9/12 mt-8"
//     />
//    </div>,
//     'Market Research': <div> <h2 className='text-red-600 font-bold text-3xl'> Market Research </h2> 
//     <BlockNoteView
//     editor={editor}
//     theme={"light"}
//     className="w-full lg:w-9/12 mt-8"
//     />
//     </div>,
//     'Customer Persona': <div> <h2 className='text-red-600 font-bold text-3xl'> Customer Persona </h2>
//     <BlockNoteView
//     editor={editor}
//     theme={"light"}
//     className="w-full lg:w-9/12 mt-8"
//     />
//      </div>,
//     'Competitor Analysis': <div> <h2 className='text-red-600 font-bold text-3xl'> Competitor Analysis </h2>
//     <BlockNoteView
//     editor={editor}
//     theme={"light"}
//     className="w-full lg:w-9/12 mt-8"
//     />
//      </div>,
//     'Business Model': <div> <h2 className='text-red-600 font-bold text-3xl'> Business Model </h2> </div>,
//     'Competitive Advantages': <div> <h2 className='text-red-600 font-bold text-3xl'> Competitive Advantages </h2> </div>,
//     Fundraising: <div> <h2 className='text-red-600 font-bold text-3xl'> Fundraising </h2> </div>,
//     'Why invest in us?': <div> <h2 className='text-red-600 font-bold text-3xl'> Why invest in us? </h2> </div>,
//     Contact: <div> <h2 className='text-red-600 font-bold text-3xl'> Contact </h2> </div>,
//     'Data Room': <div> <h2 className='text-red-600 font-bold text-3xl'> Data Room </h2> </div>,
//   };

//   return tabContents[tab];
// };

// const MyTabs = () => {
//   const [activeTab, setActiveTab] = useState('Introduction');

//   const handleTabChange = (key) => {
//     setActiveTab(key);
//   };

//   return (
//     <div className="p-4">
//       <Tabs activeKey={activeTab} onChange={handleTabChange}>
//         <TabPane tab="Introduction" key="Introduction">
//           <TabContent tab="Introduction" />
//         </TabPane>
//         <TabPane tab="Market Research" key="Market Research">
//           <TabContent tab="Market Research" />
//         </TabPane>
//         <TabPane tab="Customer Persona" key="Customer Persona">
//           <TabContent tab="Customer Persona" />
//         </TabPane>
//         <TabPane tab="Competitor Analysis" key="Competitor Analysis">
//           <TabContent tab="Competitor Analysis" />
//         </TabPane>
//         <TabPane tab="Business Model" key="Business Model">
//           <TabContent tab="Business Model" />
//         </TabPane>
//         <TabPane tab="Competitive Advantages" key="Competitive Advantages">
//           <TabContent tab="Competitive Advantages" />
//         </TabPane>
//         <TabPane tab="Fundraising" key="Fundraising">
//           <TabContent tab="Fundraising" />
//         </TabPane>
//         <TabPane tab="Why invest in us?" key="Why invest in us?">
//           <TabContent tab="Why invest in us?" />
//         </TabPane>
//         <TabPane tab="Contact" key="Contact">
//           <TabContent tab="Contact" />
//         </TabPane>
//         <TabPane tab="Data Room" key="Data Room">
//           <TabContent tab="Data Room" />
//         </TabPane>
//       </Tabs>
//     </div>
//   );
// };

// export default MyTabs;


const MyTab = () => {
  const [activeTab, setActiveTab] = useState('Introduction');

  const [blocks, setBlocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("Add wanted youtube url"); // State to store YouTube link
  const YouTubeLinkBlock = createReactBlockSpec(
    {
      type: "youtubeLink",
      propSchema: {
        ...defaultProps,
        videoId: {
          default: "",
        },
      },
      content: "none",
    },
    {
      render: ({ block }) => {
        return (
          <div
            className=" flex justify-center relative w-full"
            style={{ paddingBottom: "56.25%" }}
          >
            {block.props.videoId && (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${block.props.videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        );
      },
      toExternalHTML: ({ block }) => {
        // Generate the HTML code for the YouTube video player
        if (block.props.videoId) {
          return `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/${block.props.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        }
        return "";
      },
      parse: (element) => {
        // Parse the video ID from the HTML code if available
        const iframe = element.querySelector("iframe");
        if (iframe) {
          const src = iframe.getAttribute("src");
          const videoIdMatch = src.match(/embed\/([^?]+)/);
          if (videoIdMatch) {
            return {
              videoId: videoIdMatch[1],
            };
          }
        }
      },
    }
  );
  const insertYouTubeLink = {
    name: "Youtube",
    execute: (editor) => {
      openModal(); // Open the Modal
    },
    aliases: ["youtube", "video", "link"],
    group: "Other",
    icon: <YoutubeOutlined />,
  };
  // Function to open the Modal
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const blockSchema = {
    // Adds all default blocks.
    ...defaultBlockSchema,
    // Adds the YouTube Link block.
    youtubeLink: YouTubeLinkBlock.config,
  };
  
  // Our block specs, which contain the configs and implementations for blocks
  // that we want our editor to use.
  const blockSpecs = {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the YouTube Link block.
    youtubeLink: YouTubeLinkBlock,
  };
  
  const editor = useBlockNote({
    blockSpecs: blockSpecs,
    // uploadFile: uploadToCustomDatabase,
    slashMenuItems: [
      ...getDefaultReactSlashMenuItems(blockSchema),
      insertYouTubeLink,
    ],
    onEditorContentChange: function (editor) {
      setBlocks(editor.topLevelBlocks);
      // setIsSaved(false); // Đánh dấu là chưa lưu khi có sự thay đổi
    },
  });
  const handleInsertYouTubeLink = () => {
    if (youtubeLink.trim() !== "") {
      // Parse the video ID from the YouTube link using a regular expression
      const videoIdMatch = youtubeLink.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=|watch\?feature=player_embedded&v=|watch\?v=|watch\?v=))([^&?\s]+)/
      );

      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      if (videoId) {
        // Insert the YouTube Link block with the extracted video ID
        editor.insertBlocks(
          [
            {
              type: "youtubeLink",
              props: {
                videoId: videoId,
              },
            },
          ],
          editor.getTextCursorPosition().block,
          "after"
        );
        closeModal(); // Close the Modal
      } else {
        alert("Invalid YouTube video URL. Please provide a valid URL.");
      }
    }
  };
  
  const tabContents = {
    Introduction: <div> <h2 className='text-red-600 font-bold text-3xl'> Introduction </h2> 
    <BlockNoteView
    editor={editor}
    theme={"light"}
    className="w-full lg:w-9/12 mt-8"
    />
     <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="YouTube Link Modal"
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                margin: "auto", // Để căn giữa
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
    
   </div>,
    'Market Research': <div> <h2 className='text-red-600 font-bold text-3xl'> Market Research </h2> 
    <BlockNoteView
    editor={editor}
    theme={"light"}
    className="w-full lg:w-9/12 mt-8"
    />
     <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="YouTube Link Modal"
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                margin: "auto", // Để căn giữa
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
    </div>,
    'Customer Persona': <div> <h2 className='text-red-600 font-bold text-3xl'> Customer Persona </h2>
    <BlockNoteView
    editor={editor}
    theme={"light"}
    className="w-full lg:w-9/12 mt-8"
    />
     <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="YouTube Link Modal"
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                margin: "auto", // Để căn giữa
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
     </div>,
    'Competitor Analysis': <div> <h2 className='text-red-600 font-bold text-3xl'> Competitor Analysis </h2>
    <BlockNoteView
    editor={editor}
    theme={"light"}
    className="w-full lg:w-9/12 mt-8"
    />
     <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="YouTube Link Modal"
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                margin: "auto", // Để căn giữa
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
     </div>,
    'Business Model': <div> <h2 className='text-red-600 font-bold text-3xl'> Business Model </h2>
    <BlockNoteView
    editor={editor}
    theme={"light"}
    className="w-full lg:w-9/12 mt-8"
    />
     <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="YouTube Link Modal"
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                margin: "auto", // Để căn giữa
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
     </div>,
    'Competitive Advantages': <div> <h2 className='text-red-600 font-bold text-3xl'> Competitive Advantages </h2>
    <BlockNoteView
    editor={editor}
    theme={"light"}
    className="w-full lg:w-9/12 mt-8"
    />
     <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="YouTube Link Modal"
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                margin: "auto", // Để căn giữa
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
     </div>,
    Fundraising: <div> <h2 className='text-red-600 font-bold text-3xl'> Fundraising </h2>
    <BlockNoteView
    editor={editor}
    theme={"light"}
    className="w-full lg:w-9/12 mt-8"
    />
     <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="YouTube Link Modal"
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                margin: "auto", // Để căn giữa
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
     </div>,
    'Why invest in us?': <div> <h2 className='text-red-600 font-bold text-3xl'> Why invest in us? </h2>
    <BlockNoteView
    editor={editor}
    theme={"light"}
    className="w-full lg:w-9/12 mt-8"
    />
     <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="YouTube Link Modal"
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                margin: "auto", // Để căn giữa
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
     </div>,
    Contact: <div> <h2 className='text-red-600 font-bold text-3xl'> Contact </h2>
    <BlockNoteView
    editor={editor}
    theme={"light"}
    className="w-full lg:w-9/12 mt-8"
    />
     <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="YouTube Link Modal"
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                margin: "auto", // Để căn giữa
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
     </div>,
    'Data Room': <div> <h2 className='text-red-600 font-bold text-3xl'> Data Room </h2>
    <BlockNoteView
    editor={editor}
    theme={"light"}
    className="w-full lg:w-9/12 mt-8"
    />
     <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="YouTube Link Modal"
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                margin: "auto", // Để căn giữa
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
     </div>,
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="p-4">
      <Tabs activeKey={activeTab} onChange={handleTabChange} tabPosition="left" >
        {Object.keys(tabContents).map((tab) => (
          <TabPane tab={tab} key={tab}>
            {tabContents[tab]}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

// export default MyTabs;


function ProfileInfo() {
  return (
    <div key="1" className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold leading-tight text-gray-900">
            Making earth cooler for people, nature, climate
          </h1>
          <p className="mt-4 text-gray-600">
            Protecting the planet and its natural resources for future generations, by reducing pollution, promoting
            sustainability, and conserving energy and resources.
          </p>
          <div className="mt-6 flex gap-4">
            <Button className="bg-blue-600 text-white">Donate now</Button>
            <Button type="primary" ghost>Learn more</Button>
          </div>
          <div className="mt-8">
            <div className="text-gray-600 font-semibold">Partners:</div>
            <div className="flex mt-2 space-x-4">
              <Badge className="h-6 bg-blue-100 text-blue-600">Greenpeace</Badge>
              <Badge className="h-6 bg-blue-100 text-blue-600">United Nations</Badge>
              <Badge className="h-6 bg-blue-100 text-blue-600">WWF</Badge>
              <Badge className="h-6 bg-blue-100 text-blue-600">OXFAM</Badge>
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            alt="Volunteers working"
            className="rounded-lg object-cover"
            height="400"
            src="https://images.unsplash.com/photo-1711522676532-d6dce8a42335?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNXx8fGVufDB8fHx8fA%3D%3D"
            style={{
              aspectRatio: "600/400",
              objectFit: "cover",
            }}
            width="600"
          />
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-white" />
            <div className="h-3 w-3 rounded-full bg-white opacity-50" />
            <div className="h-3 w-3 rounded-full bg-white opacity-50" />
            <div className="h-3 w-3 rounded-full bg-white opacity-50" />
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-semibold">104M</div>
          <div className="text-gray-600 mt-2">Trees planted</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-semibold">20k+</div>
          <div className="text-gray-600 mt-2">Partners & Donors</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-semibold">90M</div>
          <div className="text-gray-600 mt-2">Tonnes of Carbon Stored</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-semibold">50+</div>
          <div className="text-gray-600 mt-2">People-Powered Projects</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-semibold">100+</div>
          <div className="text-gray-600 mt-2">New Projects</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-semibold">200k+</div>
          <div className="text-gray-600 mt-2">Active Volunteers</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-3xl font-semibold">500+</div>
        <div className="text-gray-600 mt-2">Completed Projects</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-3xl font-semibold">300M</div>
        <div className="text-gray-600 mt-2">Tonnes of Waste Recycled</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-3xl font-semibold">1000+</div>
        <div className="text-gray-600 mt-2">Global Initiatives</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-3xl font-semibold">80+</div>
        <div className="text-gray-600 mt-2">Countries Reached</div>
      </div>
        {/* Repeat the structure for other statistic cards */}
      </div>
    </div>
  )
}


export default function MyTabs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      {/* <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img
                alt="Logo"
                className="mr-3 h-10"
                height="40"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "40/40",
                  objectFit: "cover",
                }}
                width="40"
              />
              <span className="font-semibold text-xl tracking-tight">Flowbite</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a className="text-gray-700 hover:text-gray-900" href="#">
                Home
              </a>
              <a className="text-gray-700 hover:text-gray-900" href="#">
                Company
              </a>
              <a className="text-gray-700 hover:text-gray-900" href="#">
                Marketplace
              </a>
              <a className="text-gray-700 hover:text-gray-900" href="#">
                Features
              </a>
              <a className="text-gray-700 hover:text-gray-900" href="#">
                Team
              </a>
              <a className="text-gray-700 hover:text-gray-900" href="#">
                Contact
              </a>
            </div>
            <Button className="hidden md:block">Get started</Button>
          </div>
        </div>
      </nav>
      */}
      <Header/>
      <ProfileInfo/>
    
      <div className="mt-4 container mx-auto px-4 flex flex-col md:flex-row">
      

        <div className='w-full md:w-3/4 py-8 px-4 md:px-8'>
          
        <MyTab/>
        </div>

        <aside className="w-full md:w-1/4 py-8 px-4 md:pl-8">
          <div className="sticky top-8 space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar src="/placeholder.svg?height=40&width=40" />
              <div>
                <h4 className="font-bold">Jese Leos</h4>
                <p className="text-sm text-gray-500">34k followers</p>
              </div>
            </div>
            <div className="mt-4">
              <p>Hey! I'm Jese Leos. I'm a career-changer. Bootcamp grad & Dev.</p>
              <div className="mt-4">
                <h5 className="font-bold text-gray-700">LOCATION</h5>
                <p className="text-sm text-gray-500">California, United States</p>
              </div>
              <div className="mt-4">
                <h5 className="font-bold text-gray-700">JOINED</h5>
                <p className="text-sm text-gray-500">September 20, 2018</p>
              </div>
              <Button className="w-full mt-4">Follow</Button>
            </div>
            <div className="mt-8">
              <Input className="w-full" placeholder="Search..." />
            </div>
            <div className="mt-8">
              <h5 className="font-bold text-gray-700">RECOMMENDED TOPICS</h5>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge color="default">Technology</Badge>
                <Badge color="default">Money</Badge>
                <Badge color="default">Art</Badge>
                <Badge color="default">Productivity</Badge>
                <Badge color="default">Psychology</Badge>
                <Badge color="default">Design</Badge>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
