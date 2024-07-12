import React, { useState } from "react";
import { Modal } from "antd";
import SpinnerBtn from "../../../components/SpinnerBtn";
import { useSelector } from "react-redux";
import { Apple } from "lucide-react";



const FileUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const positionDataWithNetIncome = {Apple:1}; // Replace with actual data
  const positionDataWithNetIncome2 = {Banana:1}; // Replace with actual data
  const transposedData = {Brocoli:1}; // Replace with actual data

    const content = `
  Cash Flow Statement:
  ${JSON.stringify(positionDataWithNetIncome, null, 2)}

  Balance Sheet Statement:
  ${JSON.stringify(positionDataWithNetIncome2, null, 2)}

  Profit and Loss Statement:
  ${JSON.stringify(transposedData, null, 2)}
    `;
    console.log("content", content)
 
  // Convert content to a Blob
    const blob = new Blob([content], { type: 'text/plain' });

    // Create a File object from Blob
    const txtFile = new File([blob], 'financial_statements.txt', { type: 'text/plain' });

    // Update state with the File object
   
  const handleSubmit = async () => {
    setFile(txtFile);

    let formData = new FormData();
    
    formData.append("files", file);
    formData.append("chunkSize", 1000);
    formData.append("returnSourceDocuments", true);
    console.log("formData", formData)
    try {
      setLoading(true);
      const response = await fetch(
        "https://flowise-ngy8.onrender.com/api/v1/vector/upsert/5d297588-8b13-4452-8c68-a7288bfbbbe2",
        {
          method: "POST",
          body: formData
        }
      );
      const result = await response.json();
      setResponse(result);
    } catch (error) {
      console.error('Error uploading file:', error);
      setResponse({ error: 'Error uploading file' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <input type="file" onChange={handleFileChange} /> */}
      <button className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Uploading...' : 'Embed'}
      </button>
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};




const GroqJS = ({ datasrc, inputUrl }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add the following state for controlling the modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Update the handleSubmit function to set modal visibility and response content
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const newMessage = {
        role: "user",
        content:
          `1. All answers are short and using bullet points.
        2. Analyze figures and numbers vertically and horizontally. 
        3. Show remarkable changes, red flags, insights based on quantitative reasonings. 
        4. Give a score out of 10 for the data below` +
          "\n" +
          JSON.stringify(datasrc),
      };
      setMessages([newMessage]);

      let url;
      if (inputUrl === "urlPNL") {
        url =
          "https://flowise-ngy8.onrender.com/api/v1/prediction/5d297588-8b13-4452-8c68-a7288bfbbbe2";
      } else if (inputUrl === "urlCF") {
        url =
          "https://flowise-ngy8.onrender.com/api/v1/prediction/5d297588-8b13-4452-8c68-a7288bfbbbe2";
      } else if (inputUrl === "urlBS") {
        url =
          "https://flowise-ngy8.onrender.com/api/v1/prediction/5d297588-8b13-4452-8c68-a7288bfbbbe2";
      } else if (inputUrl === "urlCus") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlSale") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlCost") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlPer") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlInv") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlFund") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlLoan") {
        url = "http://localhost:300/";
      } else {
        alert("Invalid URL input");
        return;
      }

      const response = await fetch(
        // "https://news-fetcher-8k6m.onrender.com/chat",
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: [JSON.stringify(datasrc)] }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const dataJS = JSON.stringify(data);

      const assistantResponse = data.text?.replace(/[#*`]/g, "");

      const formattedAssistantResponse = assistantResponse.replace(
        /\n/g,
        "<br>"
      );
      setMessages([
        ...messages,
        { role: "assistant", content: formattedAssistantResponse },
      ]);
      setIsModalVisible(true); // Show the modal
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const {positionDataWithNetIncome} = useSelector((state) => state.cashFlow);
  console.log("CF", positionDataWithNetIncome);
  const {positionDataWithNetIncome2} = useSelector((state) => state.balanceSheet);
  console.log("BS", positionDataWithNetIncome2);
  const {transposedData} = useSelector((state) => state.profitAndLoss);
  console.log("PL", transposedData);


  return (
    <div className=" flex flex-col rounded-md  ">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
        onClick={handleSubmit}
      >
        {isLoading ? <SpinnerBtn /> : "Analyze"}
      </button>
      <Modal
        open={isModalVisible}
        footer={null}
        centered
        onCancel={() => setIsModalVisible(false)}
        width="60%"
        style={{ top: 20 }}
      >
        {messages.length > 0 && (
          <div
            dangerouslySetInnerHTML={{
              __html: messages[messages.length - 1].content,
            }}
          />
        )}
      </Modal>
      <FileUploadComponent/>
    </div>
  );
};

export default GroqJS;
