import React from 'react';
import { Link } from 'react-router-dom';

const JoinClassButton = ({ room, username }) => {
  // If both room and username are available, display the Join button
  if (room && username) {
    return (
      <div className="flex justify-center">
        <Link to={`/call/${username}/${room}`}>
          <input
            type="button"
            value="Join Class"
            className="bg-green-600 text-white py-1 px-3 rounded-lg cursor-pointer"
          />
        </Link>
      </div>
    );
  }

  return null; // If room or username is missing, don't render anything
};

export default JoinClassButton;
