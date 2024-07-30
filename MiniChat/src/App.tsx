import React, { useState } from 'react';
import ChatRoom from './components/ChatRoom';
import JoinRoom from './components/JoinRoom';
import './styles.css';

const App: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [room, setRoom] = useState<string>('');

  return (
    <div className="App">
      {room ? (
        <ChatRoom username={username} room={room} />
      ) : (
        <JoinRoom setUsername={setUsername} setRoom={setRoom} />
      )}
    </div>
  );
};

export default App;
