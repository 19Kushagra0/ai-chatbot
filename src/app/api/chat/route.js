import { NextResponse } from "next/server";
const apiKey = process.env.GEMINI_API_KEY;

let aiData = [];
let userData = [];
let conversationData = [];
// let conversationText = [];

export async function POST(req) {
  try {
    const response = await req.json();

    const userText = response.userResponse;
    conversationData.push({
      role: "user",
      content: userText,
    });

    let mappedArray = conversationData.map((msg, index, fullArray) => {
      return msg.role + ": " + msg.content;
    });

    let conversationText = mappedArray.join("\n");

    // for (let i = 0; i < conversationData.length; i++) {
    //   conversationText =
    //     conversationText +
    //     "\n" +
    //     conversationData[i].role +
    //     ": " +
    //     conversationData[i].content;
    // }
    console.log(conversationText + "\n");

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: conversationText }],
            },
          ],
        }),
      }
    );
    const aiReply = await aiResponse.json();

    const aiText =
      aiReply?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Error: No response from model.";

    userData.push(userText);
    aiData.push(aiText);

    // console.log(aiData);
    // console.log(userData);

    conversationData.push({
      role: "ai",
      content: aiText,
    });

    return NextResponse.json({
      message: aiText,
    });
  } catch (error) {
    console.log("Failed to send data to frontend");

    return NextResponse.json({ message: "Failed to send data to frontend" });
  }
}
