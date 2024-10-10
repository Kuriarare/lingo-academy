import React from 'react';
import { Link } from 'react-router-dom';

const JoinClassButton = ({ isButtonVisible, room, username }) => {
  // Create a URL for joining the class using the room and username
  const joinClassUrl = `/call/${username}/${room}`;

  return (
    <div className="flex justify-center">
      {/* Conditionally render the Join Room button */}
      {isButtonVisible && (
        <Link to={joinClassUrl}>
          <button
            type="button"
            className="bg-green-600 text-white py-1 px-3 rounded-lg cursor-pointer"
          >
            Join Class
          </button>
        </Link>
      )}
    </div>
  );
};

export default JoinClassButton;
