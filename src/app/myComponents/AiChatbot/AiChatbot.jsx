"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import "@/app/myComponents/AiChatbot/AiChatbot.css";
import ReactMarkdown from "react-markdown";
export default function AiChatbot() {
  const [userData, setUserData] = useState([]);
  const [aiData, setAiData] = useState([]);

  // input handler
  const [inputValue, setInputValue] = useState("");
  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };

  // input button
  const inputButton = async () => {
    // check if value is undefined
    if (inputValue.trim() === "") {
      return;
    }

    // saving user data
    const copydata = [...userData];
    copydata.push(inputValue);
    setUserData(copydata);

    // show typing till ai respond
    const showTyping = [...aiData];
    showTyping.push("typing...");
    setAiData(showTyping);

    setInputValue("");
    console.log(inputValue);
    let aiReply = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "Data send to backend",
          userResponse: inputValue,
        }),
      });
      const data = await response.json();
      aiReply = data.message;
    } catch (error) {
      console.log("failed to send data to backend");
    }

    const copyAi = [...aiData];
    copyAi.push(aiReply);
    setAiData(copyAi);
  };
  // auto scroll down
  //     step 6(extra) part 1 to 4
  //  auto scroll(extra) part 1
  const messagesEndRef = useRef(null);
  //  auto scroll down(extra) part 2
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  //  auto scroll down(extra) part 3
  useEffect(() => {
    scrollToBottom();
  }, [userData, aiData]);

  // also change css
  //   .aiChatbot-messages {
  //   overflow-y: auto;
  // }

  return (
    <div className="aiChatbot-full-container">
      {/* Header */}
      <div className="aiChatbot-header">
        <div className="header-left">
          <span className="header-title">Chat bot</span>
        </div>
      </div>
      {/* Messages Area */}
      <div className="aiChatbot-messages">
        {userData.map((el, index, arr) => {
          return (
            <div key={index} className="aiChatbot-messages-box">
              <div className="message-row user-row">
                <div className="message-bubble user-msg">{el}</div>
              </div>

              <div className="message-row ai-row">
                <div className="message-bubble ai-msg">
                  <ReactMarkdown>{aiData[index]}</ReactMarkdown>
                </div>
              </div>
            </div>
          );
        })}
        {/* // auto scroll down part 4 */}
        <div ref={messagesEndRef} className=""></div>
      </div>
      {/* Input Area */}
      <div className="aiChatbot-input-area">
        {/* plus button */}
        <button className="plus-button">
          <Image
            alt="asd"
            height={40}
            width={40}
            src="/icon/add.svg"
            className="plus-icon"
          />
        </button>

        {/* Textarea instead of Input */}
        <textarea
          placeholder="Ask me"
          className="chat-input"
          rows="1"
          value={inputValue}
          onChange={inputHandler}
          // if enter key is pressed take input
          onKeyDown={(e) => {
            // if (e.key === "Enter") {
            //   e.preventDefault(); // prevents new line
            //   inputButton(); // triggers your send function
            // }
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // stop new line
              inputButton(); // send message
            }
          }}
        ></textarea>
        <button className="send-btn" onClick={inputButton}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}
