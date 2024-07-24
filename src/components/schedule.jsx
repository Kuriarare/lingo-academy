import { useState } from "react";
import { Link } from "react-router-dom";
const Shchedule = () => {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  return (
    <form method="post" action="" className="">
      <label htmlFor="username">Username</label>

      <input
        value={username}
        title="username"
        onInput={(e) => setUsername(e.target.value)}
        className="border-2 border-black"
      />

      <label htmlFor="room">Room</label>

      <input
        value={room}
        title="room"
        onInput={(e) => setRoom(e.target.value)}
        className="border-2 border-black"

      />
      <Link to={`/call/${username}/${room}`}>
        <input type="submit" name="submit" value="Join Room" className="bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer"/>
      </Link>
    </form>
  );
}

export default Shchedule