"use client";
import React, { useState, useEffect } from "react";
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';


//This is not being used for now.

// all available props
const theme = {
  background: '#f5f8fb',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#EF6C00',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#EF6C00',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

const Chat = () => {

    const   steps=[
      {
        id: '1',
        message: "Hi welcome to True Reach. I'm your assistance Nouncy! What is your name?",
        trigger: '2',
      },
      {
        id: '2',
        user: true,
        trigger: '3',
      },
      {
        id: '3',
        message: 'Hi {previousValue}, nice to meet you!',
        end: true,
      },
    ];

    const [conversationList, setConversationList] = useState([{name: 'bot', message: 'how can I help you?'}]);

    const [message, setMessage] = useState("");

    return (
        <>
          <ThemeProvider theme={theme}>
            <ChatBot steps={steps} />
          </ThemeProvider>
        </>
    );  
};


export default Chat;