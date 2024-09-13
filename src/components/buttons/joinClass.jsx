import React from 'react'
import { Link } from 'react-router-dom'

const JoinClassButton = ({isButtonVisible, room, username, setRoom, setUsername}) => {
  return (
    <div className="flex justify-center">
    <form
      method="post"
      action=""
      className="flex flex-col md:flex-row gap-3 items-start justify-center"
    >
      {/* Hidden inputs to store the username and room */}
      <input
        type="hidden"
        value={username}
        title="username"
        onInput={(e) => setUsername(e.target.value)}
      />
      <input
        type="hidden"
        value={room}
        title="room"
        onInput={(e) => setRoom(e.target.value)}
      />

      {/* Conditionally render the Join Room button */}
      {isButtonVisible && (
        <Link to={`/call/${username}/${room}`}>
          <input
            type="submit"
            name="submit"
            value="Join Class"
            className="bg-green-600 text-white py-1 px-3 rounded-lg cursor-pointer"
          />
        </Link>
      )}
    </form>
  </div>
  )
}

export default JoinClassButton