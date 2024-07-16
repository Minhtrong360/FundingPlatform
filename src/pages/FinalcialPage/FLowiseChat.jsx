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

const themes={
  button: {
      backgroundColor: "#3B81F6",
      right: 20,
      bottom: 20,
      size: 48, // small | medium | large | number
      dragAndDrop: true,
      iconColor: "white",
      customIconSrc: "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
  },
  tooltip: {
      showTooltip: false,
      tooltipMessage: 'Hi There 👋!',
      tooltipBackgroundColor: 'blue',
      tooltipTextColor: 'white',
      tooltipFontSize: 16,
  },
  chatWindow: {
      showTitle: true,
      title: 'BeeKrowd agent',
      titleAvatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
      welcomeMessage: 'Hello! I am your CFO agent. How can I help you?',
      errorMessage: 'There is error, please try again',
      backgroundColor: "#ffffff",
      height: 600,
      width: 400,
      fontSize: 14,
      poweredByTextColor: "#2527EE",
      botMessage: {
          backgroundColor: "#f7f8ff",
          textColor: "#303235",
          showAvatar: true,
          avatarSrc: "https://img.icons8.com/?size=100&id=xaquNfre75yC&format=png&color=000000",
      },
      userMessage: {
          backgroundColor: "#3B81F6",
          textColor: "#ffffff",
          showAvatar: false,
          avatarSrc: "",
      },
      textInput: {
          placeholder: 'Type your question',
          backgroundColor: '#ffffff',
          textColor: '#303235',
          sendButtonColor: '#3B81F6',
          maxChars: 100,
          maxCharsWarningMessage: 'You exceeded the characters limit. Please input less than 50 characters.',
          autoFocus: true, // If not used, autofocus is disabled on mobile and enabled on desktop. true enables it on both, false disables it on both.
      },
      feedback: {
          color: '#303235',
      },
      footer: {
          textColor: '#303235',
          text: 'Powered by',
          company: 'BeeKrowd',
          companyLink: 'https://beekrowd.com',
      }
  }
}
// const FlowiseChat = () => {
//   return (
//     <BubbleChat
//       chatflowid="39943ce9-4b02-44a9-be58-b53010dbf83b"
//       apiHost="https://flowise-ngy8.onrender.com"
//       theme={theme}
//     />
//   );
// };

// export default FlowiseChat;

const FlowiseChat = ({ page }) => {
  let chatflowid;
  if (page === 'Home') {
    chatflowid = 'd07c777f-6204-4699-92ea-9c0abb67d157';
  } else if (page === 'FM') {
    chatflowid = '39943ce9-4b02-44a9-be58-b53010dbf83b';
  } else if (page === '-') {
    chatflowid = '';
  } else {
    chatflowid = 'd07c777f-6204-4699-92ea-9c0abb67d157'; // Default to Home if no valid type is provided
  }

  return (
    <BubbleChat
      chatflowid={chatflowid}
      apiHost="https://flowise-ngy8.onrender.com"
      theme={themes}
    />
  );
};

export default FlowiseChat;