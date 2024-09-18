import { BubbleChat } from "flowise-embed-react";
import customIcon from "../../../src/assets/icon/User, Chat, Messages, Bubble.svg";
import support from "../../../src/assets/icon/User, Chat, Messages, Bubble2.svg";
// const apiUrl = process.env.REACT_APP_PUBLIC_SUPABASE_URL;
// const apiKey = process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY;
//
const apiUrl = process.env.REACT_APP_PUBLIC_SUPABASE_URL;
const apiKey = process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY;
// console.log("apiUrl", apiUrl)
// console.log("key" , apiKey);

// d07c777f-6204-4699-92ea-9c0abb67d157
// 39943ce9-4b02-44a9-be58-b53010dbf83b
const FlowiseChat = ({ page, projectid }) => {
  let chatflowid;
  let title;
  let welcomeMessage;
  if (page === "Home") {
    chatflowid = "d07c777f-6204-4699-92ea-9c0abb67d157";
    title = "BeeKrowd agent";
    welcomeMessage = "Hello! I am BeeKrowd agent. How can I help you?";
  } else if (page === "FM") {
    // chatflowid = '39943ce9-4b02-44a9-be58-b53010dbf83b' ;
    chatflowid = "15adb1aa-84aa-4ddc-83d1-109174d2d387";
    title = "CFO agent";
    welcomeMessage = "Hello! I am your CFO agent. How can I help you?";
  } else if (page === "-") {
    chatflowid = "";
  } else {
    chatflowid = "d07c777f-6204-4699-92ea-9c0abb67d157"; // Default to Home if no valid type is provided
  }

  return (
    <BubbleChat
      chatflowid={chatflowid}
      apiHost="https://flowise-ngy8.onrender.com"
      chatflowConfig={{
        text: projectid,
        vars: {
          apiKey: apiKey,
          apiUrl: apiUrl,
        },
      }}
      theme={{
        button: {
          backgroundColor: "#800000",
          right: 20,
          bottom: 20,
          size: 48, // small | medium | large | number
          dragAndDrop: true,
          iconColor: "white",
          // customIconSrc: "https://img.icons8.com/?size=100&id=NspKf9KAs70I&format=png&color=FFFFFF",
          customIconSrc: customIcon,
        },
        tooltip: {
          showTooltip: false,
          tooltipMessage: "Hi There 👋!",
          tooltipBackgroundColor: "blue",
          tooltipTextColor: "white",
          tooltipFontSize: 16,
        },
        chatWindow: {
          showTitle: true,
          title: title,
          // titleAvatarSrc: 'https://img.icons8.com/?size=100&id=xaquNfre75yC&format=png&color=000000',
          titleAvatarSrc: customIcon,
          welcomeMessage: welcomeMessage,
          errorMessage: "There is error, please try again",
          backgroundColor: "#ffffff",
          height: 600,
          width: 400,
          fontSize: 14,
          poweredByTextColor: "#2527EE",
          botMessage: {
            backgroundColor: "#f7f8ff",
            textColor: "#303235",
            showAvatar: true,
            // avatarSrc: "https://img.icons8.com/?size=100&id=xaquNfre75yC&format=png&color=000000",
            avatarSrc: support,
          },
          userMessage: {
            backgroundColor: "#3B81F6",
            textColor: "#ffffff",
            showAvatar: false,
            avatarSrc: "",
          },
          textInput: {
            placeholder: "Type your question",
            backgroundColor: "#ffffff",
            textColor: "#303235",
            sendButtonColor: "#3B81F6",
            maxChars: 200,
            maxCharsWarningMessage:
              "You exceeded the characters limit. Please input less than 100 characters.",
            autoFocus: true, // If not used, autofocus is disabled on mobile and enabled on desktop. true enables it on both, false disables it on both.
          },
          feedback: {
            color: "#303235",
          },
          footer: {
            textColor: "#303235",
            text: "Powered by",
            company: "BeeKrowd",
            companyLink: "https://beekrowd.com",
          },
        },
      }}
    />
  );
};

export default FlowiseChat;
