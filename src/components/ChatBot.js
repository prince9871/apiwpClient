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

  const sendMessage = () => {
    // Validate input
    if (input.trim() === '') {
      setInputError(true);
      return;
    }
  
    // Show loading animation
    setLoading(true);
  
    // Process user input and provide appropriate suggestions
    let botMessage = '';
    if (input.toLowerCase() === 'hi') {
      botMessage = 'Please type "a" or "b".';
      setMessages([...messages, { text: input, user: true }, { text: botMessage, bot: true }]);
      setInput('');
      setLoading(false); // Hide loading animation after setting the suggestions
      return;
    }
  
    // For other inputs, make a request to the database and display the bot's response after 1 second
    fetch('http://192.168.1.11:3001/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    })
      .then(response => response.json())
      .then(data => {
        setTimeout(() => {
          setMessages([...messages, { text: input, user: true }, { text: data.message, bot: true }]);
          setLoading(false); // Hide loading animation after receiving the response
          setInput('');
        }, 1000); // Delay the bot's response by 1 second
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false); // Hide loading animation in case of an error
        setInput('');
      });
  };
  
  

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.user ? 'message right-message' : message.bot ? 'message left-message' : ''
            }
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      {loading && <div className="loading">Loading...</div>}
      {inputError && <div className="error-message">Please type a message.</div>}
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
    </div>
  );
};

export default Chatbot;
