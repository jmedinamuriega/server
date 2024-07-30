import React, { useState, useEffect, useRef } from 'react';
import socket from './socket';
import './Chatroom.css';

interface ChatRoomProps {
  username: string;
  room: string;
}

interface Message {
  username: string;
  message: string;
  timestamp: Date;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ username, room }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem(`messages_${room}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Joining room:', room);
    socket.emit('joinRoom', room);

    const handleMessage = (messageData: Message) => {
      console.log('Received message:', messageData);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, messageData];
        localStorage.setItem(`messages_${room}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      setLoading(false);
    };

    const handleError = () => {
      console.error('Socket connection error');
      setError('Failed to connect to the server.');
      setLoading(false);
    };

    socket.on('message', handleMessage);
    socket.on('connect_error', handleError);

    // Set loading to false after setting up listeners, in case no messages are received
    setLoading(false);

    return () => {
      socket.off('message', handleMessage);
      socket.off('connect_error', handleError);
    };
  }, [room]);

  const sendMessage = () => {
    if (newMessage) {
      console.log('Sending message:', newMessage);
      socket.emit('message', { room, message: newMessage, username });
      setNewMessage('');
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredMessages = filter
    ? messages.filter((msg) => msg.username.includes(filter))
    : messages;

  return (
    <div className="ChatRoom">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Filter by username"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="message-container">
            {filteredMessages.map((msg, index) => (
              <div className="message" key={index}>
                <strong>{msg.username}</strong> <span>[{new Date(msg.timestamp).toLocaleTimeString()}]:</span> {msg.message}
              </div>
            ))}
            <div ref={messageEndRef} className="message-end" />
          </div>
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
