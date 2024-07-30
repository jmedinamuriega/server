import React, { useState } from 'react';
import './JoinRoom.css';

interface JoinRoomProps {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ setUsername, setRoom }) => {
  const [name, setName] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');

  const joinRoom = () => {
    console.log('Username:', name);
    console.log('Room:', roomName);
    if (name && roomName) {
      setUsername(name);
      setRoom(roomName);
    }
  };

  return (
    <div className="JoinRoom">
      <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Room"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default JoinRoom;
