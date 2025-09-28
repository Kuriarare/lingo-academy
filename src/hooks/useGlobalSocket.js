import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessagesForTeacher,
  fetchUnreadCountsForStudent,
} from "../redux/chatSlice";
import { socket } from "../socket";

const useGlobalSocket = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo?.user);

  useEffect(() => {
    if (user) {
      socket.connect();

      const handleNewChat = () => {
        if (user.role === "teacher") {
          dispatch(fetchMessagesForTeacher());
        } else if (user.role === "user") {
          dispatch(fetchUnreadCountsForStudent());
        }
      };

      socket.on("newChat", handleNewChat);

      return () => {
        socket.off("newChat", handleNewChat);
      };
    } else if (socket.connected) {
      socket.disconnect();
    }
  }, [user, dispatch]);
};

export default useGlobalSocket;