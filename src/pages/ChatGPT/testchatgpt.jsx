import React, { useState } from 'react';
import ChatgptClone from "./chatgpt";

function TestChatGpt() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Hàm mở cửa sổ
  const openChat = () => {
    setIsChatOpen(true);
  };

  // Hàm đóng cửa sổ
  const closeChat = () => {
    setIsChatOpen(false);
  };
  return(
    <div>
      {/* Kiểm tra trạng thái của cửa sổ và hiển thị nút phù hợp */}
      {!isChatOpen ? (
        <button onClick={openChat}>Open Chat</button>
      ) : (
        <div className="chat-window">
          <button onClick={closeChat}>Close Chat</button>
          <ChatgptClone />
        </div>
      )}
    </div>
  );
}

export default TestChatGpt
