import React, { useEffect, useState, useRef } from 'react';
import './ChatBot.css';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add initial welcome message when the component is first loaded
    setMessages([{ text: 'Welcome to Chatbot System! Press "hi" to start.', bot: true }]);
  }, []);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Reset input error when user starts typing
    setInputError(false);
  };

  const sendMessage = async () => {
    // Validate input
    if (input.trim() === '') {
      setInputError(true);
      return;
    }

    setMessages([...messages, { text: input, user: true }]); // Display user's message immediately
    setLoading(true); // Show loading animation while fetching data

    setTimeout(async () => {
      const response = await fetch('http://192.168.1.11:3001/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages([...messages, { text: data.message, bot: true }]); // Display bot's response
      setLoading(false); // Hide loading animation after receiving the response
      setInput('');
    }, 1000); // Delay the bot's response by 1 second
  };

  return (
    <div className="chat-container">
      
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={message.bot ? 'message left-message' : 'message right-message'}>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      {loading && <div className="loading">Loading...</div>}
      <div className="input-container">
    <input
      type="text"
      value={input}
      onChange={handleInputChange}
      placeholder="Type your message..."
      className={inputError ? 'input-error' : ''}
    />
    <button onClick={sendMessage}>Send</button>
  </div>
  {inputError && <div className="error-message">Please type a message.</div>}
</div>
  );
};

export default Chatbot;
