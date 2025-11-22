// ai chatbot in 5 step + 3 extra step

"use client";
import React, { useState, useRef, useEffect } from "react";

import "@/app/myComponents/AiChatbot/AiChatbot.css";

export default function AiChatbot() {
  const [userData, setUserData] = useState([]);
  const [aiData, setAiData] = useState([]);

  const [inputValue, setInputValue] = useState("");

  // step 1
  //   api key
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // step 2
  // ask Gemini
  const sendMessageToGemini = async (userMessage, apiKey) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: userMessage }],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Error: No response from model."
      );
    } catch (e) {
      return "Error connecting to Gemini API.";
    }
  };

  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };

  const inputButton = async () => {
    console.log(inputValue);

    // check if value is undefined
    if (inputValue.trim() === "") {
      return;
    }

    // saving user data
    const copydata = [...userData];
    copydata.push(inputValue);
    setUserData(copydata);

    //  step 7(extra)
    // show typing till ai respond
    const showTyping = [...aiData];
    showTyping.push("typing...");
    setAiData(showTyping);

    setInputValue("");

    // step 3
    // sending user data to gemini and getting its response
    const aiReply = await sendMessageToGemini(inputValue, API_KEY);

    // step 4

    // saving gemini data
    const copyAi = [...aiData];
    copyAi.push(aiReply);
    setAiData(copyAi);
  };

  //  step 6(extra) part 1 to 4
  //  step 6(extra) part 1
  const messagesEndRef = useRef(null);
  //  step 6(extra) part 2
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  //  step 6(extra) part 3
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
                {/* step 5 */}
                <div className="message-bubble ai-msg">{aiData[index]}</div>
              </div>
            </div>
          );
        })}
        {/* // step 6(extra) part 4 */}
        <div ref={messagesEndRef} className=""></div>
      </div>
      {/* Input Area */}
      <div className="aiChatbot-input-area">
        {/* Textarea instead of Input */}
        <textarea
          placeholder="Ask me"
          className="chat-input"
          rows="1"
          value={inputValue}
          onChange={inputHandler}
          // if enter key is pressed take input
          onKeyDown={(e) => {
            {
              /* // step 8(extra)  */
            }
            if (e.key === "Enter") {
              e.preventDefault(); // prevents new line
              inputButton(); // triggers your send function
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
