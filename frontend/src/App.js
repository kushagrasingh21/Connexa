import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('previousMessages', (msgs) => {
      setChat(msgs);
    });

    socket.on('newMessage', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  return (
    <div className="App">
      <h1>Chat App</h1>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className="message">
            <span>{msg.time}:</span> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="input-box">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
