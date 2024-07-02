import { BubbleChat } from "flowise-embed-react";

const theme = {
  button: {
    backgroundColor: "#2563EB",
    right: 20,
    bottom: 20,
    size: "medium",
    iconColor: "white",
    customIconSrc:
      "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
  },
  chatWindow: {
    welcomeMessage: "Hello! How can I help you?",
    backgroundColor: "#ffffff",
    height: 600,
    width: 400,
    fontSize: 14,
    poweredByTextColor: "#ffffff",
    botMessage: {
      backgroundColor: "#f7f8ff",
      textColor: "#303235",
      showAvatar: true,
      avatarSrc:
        "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png",
    },
    userMessage: {
      backgroundColor: "#2563EB",
      textColor: "#ffffff",
      showAvatar: true,
      avatarSrc:
        "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
    },
    textInput: {
      placeholder: "Type your question",
      backgroundColor: "#ffffff",
      textColor: "#303235",
      sendButtonColor: "#2563EB",
    },
  },
};

const FlowiseChat = () => {
  return (
    <BubbleChat
      chatflowid="39943ce9-4b02-44a9-be58-b53010dbf83b"
      apiHost="https://flowise-ngy8.onrender.com"
      theme={theme}
    />
  );
};

export default FlowiseChat;
